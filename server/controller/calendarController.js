
import { google } from 'googleapis';
import { DateTime } from 'luxon';
import dotenv from 'dotenv';
import supabase from '../db/supabase.js';
dotenv.config();
const BUSINESS_TIMEZONE =  'Asia/Karachi';

// Helper: Fresh OAuth Client instance per request (Prevents token collisions)
const createOAuthClient = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL}/api/v1/calendar/google/callback`
    );
};

// 1. Vendor Google OAuth URL
export const getAuthUrl = (req, res) => {
    const userId = req.query.userId;
    const oauth2Client = createOAuthClient();
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: userId
    });
    res.status(200).json({ url });
};

// 2. Google OAuth Callback
export const googleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        const oauth2Client = createOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);

        const { error } = await supabase
            .from('vendors')
            .update({
                google_refresh_token: tokens.refresh_token,
                is_calendar_connected: true
            })
            .eq('id', state);

        if (error) throw error;
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?calendar=success`);
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?calendar=failed`);
    }
};

// Helper: Vendor Specific Calendar Client
const getVendorCalendarClient = async (userId) => {
    const { data: vendor, error } = await supabase
        .from('vendors')
        .select('google_refresh_token')
        .eq('id', userId)
        .maybeSingle();

    if (error || !vendor || !vendor.google_refresh_token) return null;

    const oauth2Client = createOAuthClient();
    oauth2Client.setCredentials({ refresh_token: vendor.google_refresh_token });
    return google.calendar({ version: 'v3', auth: oauth2Client });
};

// 3. Free/Busy Slots Check (Today + Tomorrow support)
export const checkFreeSlots = async (userId) => {
    try {
        const calendar = await getVendorCalendarClient(userId);
        if (!calendar) return "We are available 24/7. Offer any time that suits the customer.";

        const now = DateTime.now().setZone(BUSINESS_TIMEZONE);
        const windowEnd = now.plus({ days: 2 }).endOf('day');

        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toUTC().toISO(),
            timeMax: windowEnd.toUTC().toISO(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: BUSINESS_TIMEZONE
        });

        // Filter out cancelled events
        const activeEvents = (response.data.items || []).filter(e => e.status !== 'cancelled');

        if (activeEvents.length === 0) {
            return "Currently COMPLETELY FREE for today and tomorrow. Offer any time.";
        }

        const busySlots = activeEvents.map(event => {
            const start = DateTime.fromISO(event.start.dateTime || event.start.date).setZone(BUSINESS_TIMEZONE);
            const end = DateTime.fromISO(event.end.dateTime || event.end.date).setZone(BUSINESS_TIMEZONE);
            return `${start.toFormat('ccc d LLL, h:mm a')} - ${end.toFormat('h:mm a')}`;
        });

        return `ALREADY BOOKED BUSY SLOTS: [ ${busySlots.join(', ')} ]. STRICTLY DO NOT book during these times. Offer alternative free slots.`;
    } catch (error) {
        console.error("Error checking free slots:", error);
        return "We are available 24/7. Offer any time that suits the customer.";
    }
};

// 4. Create Event from AI extraction
// 4. Create Event from AI extraction
export const createEventFromAI = async (userId, aiData) => {
    try {
        const calendar = await getVendorCalendarClient(userId);
        
        // 🚨 NAYA LOG: Agar Calendar token nahi mila toh yahan pakra jayega
        if (!calendar) {
            console.error(`🚨 CALENDAR ERROR: Vendor (ID: ${userId}) ka Google Refresh Token database mein nahi mila!`);
            return null;
        }

        let startDT = DateTime.now().setZone(BUSINESS_TIMEZONE);

        // Emergency handling: agar ASAP/Emergency ho to current time + 15 mins
        if (aiData.isEmergency) {
            startDT = startDT.plus({ minutes: 15 });
        }

        const rawTime = aiData.isoStartTime || aiData.start_time || aiData.startTime || aiData.time;
        const rawPreferred = aiData.preferredTime || aiData.preferred_time;

        if (rawTime) {
            const naiveDatePart = rawTime.replace(/(Z|[+-]\d{2}:?\d{2})$/, '');
            const parsed = DateTime.fromISO(naiveDatePart, { zone: BUSINESS_TIMEZONE });
            if (parsed.isValid) startDT = parsed;
        } else if (rawPreferred && !aiData.isEmergency) {
            const match = rawPreferred.match(/(\d+)(?::(\d+))?\s*(AM|PM|am|pm)?/i);
            if (match) {
                let hours = parseInt(match[1]);
                const minutes = match[2] ? parseInt(match[2]) : 0;
                const ampm = match[3] ? match[3].toUpperCase() : null;

                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;

                startDT = startDT.plus({ days: 1 }).set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
            }
        }

        const endDT = startDT.plus({ hours: 1 });

        // Overlap Check
        const overlapCheck = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startDT.toUTC().toISO(),
            timeMax: endDT.toUTC().toISO(),
            singleEvents: true,
            timeZone: BUSINESS_TIMEZONE
        });

        const hasConflict = (overlapCheck.data.items || []).some(e => e.status !== 'cancelled');

        if (hasConflict) {
            console.log("🚨 STOPPED DOUBLE BOOKING! Slot already occupied in Google Calendar.");
            return null;
        }

        const event = {
            summary: `Locksmith: ${aiData.service_type || 'Service Call'} | ${aiData.name || 'Customer'}`,
            description: `Customer Name: ${aiData.name || 'N/A'}\nPhone: ${aiData.phone || 'N/A'}\nAddress: ${aiData.address || 'N/A'}\nService Type: ${aiData.service_type || 'N/A'}\nVehicle Details: ${aiData.vehicle_details || 'N/A'}\nIssue: ${aiData.issue || 'N/A'}\nEmergency: ${aiData.isEmergency ? 'YES 🚨' : 'No'}`,
            start: {
                dateTime: startDT.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
            end: {
                dateTime: endDT.toUTC().toISO(),
                timeZone: BUSINESS_TIMEZONE,
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        return { 
            id: response.data.id,
            link: response.data.htmlLink, 
            startTimeISO: startDT.toUTC().toISO() 
        };
    } catch (err) {
        // 🚨 NAYA LOG: Google Calendar ka Asli Error yahan print hoga
        console.error("🚨 GOOGLE API ASLI ERROR:", err.response?.data || err.message || err);
        return null;
    }
};