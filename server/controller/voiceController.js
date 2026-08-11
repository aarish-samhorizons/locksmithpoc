
import { checkFreeSlots, createEventFromAI } from './calendarController.js';
import supabase from '../db/supabase.js';

// =========================================================================
// Helper: Vapi Payload & Caller Info Safe Parser
// =========================================================================
const extractVapiPayload = (req) => {
    // Vapi function arguments ya seedha body
    const rawArgs = req.body.message?.toolCalls?.[0]?.function?.arguments || req.body;
    let parsedArgs = rawArgs;

    // Vapi kabhi JSON object bhejta hai aur kabhi stringified JSON
    if (typeof rawArgs === 'string') {
        try {
            parsedArgs = JSON.parse(rawArgs);
        } catch (e) {
            console.error("⚠️ Failed to parse Vapi string arguments:", e);
            parsedArgs = {};
        }
    }

    // Caller ID extraction (Agar customer phone na bole to Vapi call payload se auto-fetch hoga)
    const callerNumber = req.body.message?.call?.customer?.number || null;

    // Multi-tenant: Vendor ID query params, payload args, ya fallback se milega
    const vendorId = "cc7cc569-f62c-49b2-9f42-d8852d4e3e7b";

    return { args: parsedArgs, callerNumber, vendorId };
};

// =========================================================================
// 1. Tool: Check Free Slots (Voice Call Slot Checking)
// =========================================================================
export const voiceCheckSlots = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("📞 [VAPI HIT] Action: CHECK FREE SLOTS");
        console.log("==================================================");

        const { vendorId } = extractVapiPayload(req);

        console.log(`🔍 Checking calendar availability for Vendor: ${vendorId}...`);
        const scheduleStatus = await checkFreeSlots(vendorId);
        console.log(`✅ Schedule Result: "${scheduleStatus}"`);

        return res.status(200).json({
            success: true,
            message: scheduleStatus
        });

    } catch (error) {
        console.error("❌ Voice Check Slots Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// =========================================================================
// 2. Tool: Book Appointment (Auto / Residential / Almari / Safe Handling)
// =========================================================================
export const voiceBookAppointment = async (req, res) => {
    try {
        console.log("\n==================================================");
        console.log("📞 [VAPI HIT] Action: BOOK APPOINTMENT");
        console.log("==================================================");

        const { args, callerNumber, vendorId } = extractVapiPayload(req);

        // Standardize data from Voice LLM
        const aiData = {
            ...args,
            name: args.name || "Customer",
            phone: args.phone || callerNumber || "Unknown Caller Phone",
            address: args.address || "No Address Provided",
            issue: args.issue || "Lockout / Key Service Call",
            service_type: args.service_type || args.serviceType || null,
            vehicle_details: args.vehicle_details || args.vehicleDetails || null,
            preferredTime: args.preferredTime || args.preferred_time || args.time || "Immediate / ASAP",
            isEmergency: Boolean(args.isEmergency || args.is_emergency)
        };

        console.log("📝 Extracted Booking Data:", aiData);
        console.log(`🚀 Sending booking request to Google Calendar for Vendor: ${vendorId}...`);

        // 1. Create Google Calendar Event
        const bookingResult = await createEventFromAI(vendorId, aiData);

        if (bookingResult) {
            console.log(`✅ SUCCESS! Event created on Google Calendar: ${bookingResult.link}`);

            // 2. Dynamic Description Builder (Handles Car, House door, Almari, Safes)
            const fullIssueDescription = [
                aiData.service_type ? `[${aiData.service_type}]` : '',
                aiData.vehicle_details ? `Vehicle: ${aiData.vehicle_details}` : '',
                aiData.issue || ''
            ].filter(Boolean).join(' - ');

            // 3. Supabase DB Save
            if (aiData.phone && aiData.phone !== "Unknown Caller Phone") {
                try {
                    let customerId;

                    // Check existing customer safely (maybeSingle avoids crashes)
                    const { data: existingCustomer } = await supabase
                        .from('customers')
                        .select('id')
                        .eq('phone_number', aiData.phone)
                        .maybeSingle();

                    if (existingCustomer) {
                        customerId = existingCustomer.id;
                        await supabase.from('customers').update({ 
                            issue_description: fullIssueDescription,
                            address: aiData.address
                        }).eq('id', customerId);
                    } else {
                        const { data: newCustomer, error: customerInsertError } = await supabase
                            .from('customers')
                            .insert([{ 
                                vendor_id: vendorId,
                                name: aiData.name, 
                                phone_number: aiData.phone,
                                address: aiData.address,
                                issue_description: fullIssueDescription
                            }])
                            .select('id')
                            .single();

                        if (customerInsertError) throw customerInsertError;
                        customerId = newCustomer.id;
                    }

                    // Save Appointment Record
                    if (customerId) {
                        const { error: appointmentError } = await supabase
                            .from('appointments')
                            .insert([{
                                customer_id: customerId,
                                vendor_id: vendorId,
                                slot_time: bookingResult.startTimeISO, 
                                google_calendar_event_id: bookingResult.id || bookingResult.link, 
                                status: 'pending',
                                is_emergency: aiData.isEmergency
                            }]);

                        if (appointmentError) throw appointmentError;
                        console.log("✅ Voice Lead & Appointment saved in Supabase!");
                    }
                } catch (dbError) {
                    console.error("❌ Voice Supabase DB Error:", dbError);
                }
            }

            // 4. Response back to Vapi Assistant
            return res.status(200).json({
                success: true,
                message: `Appointment successfully booked for ${aiData.name} at ${aiData.address}. Time is locked in. Reassure the caller that the locksmith technician has received the dispatch and is preparing to arrive. Then politely conclude the call.`,
                link: bookingResult.link
            });
        } else {
            console.log("⚠️ Booking failed: Slot occupied or Calendar API error.");
            return res.status(400).json({
                success: false,
                message: "That specific time slot is already taken. Please ask the customer for another preferred time."
            });
        }

    } catch (error) {
        console.error("❌ Voice Booking Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};