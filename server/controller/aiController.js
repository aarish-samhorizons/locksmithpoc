import { GoogleGenerativeAI } from '@google/generative-ai';
import { asyncHandler } from '../utils/asyncHandlerUtility.js';
import ErrorHandler from '../utils/errorHandlerUtility.js';
import { createEventFromAI, checkFreeSlots } from './calendarController.js';
import supabase from '../db/supabase.js';
import 'dotenv/config';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("gemini key",genAI)
const sessions = new Map();

function getSession(userId) {
    if (!sessions.has(userId)) {
        sessions.set(userId, { messages: [], booked: false });
    }
    return sessions.get(userId);
}
export const qualifyLead = asyncHandler(async (req, res, next) => {
    // 1. Frontend se ab sirf message aur sessionId aayega
    const { message, sessionId } = req.body; 

    // 2. Vendor ID yahan backend mein hi fix kar do (No Login Required)
    const vendorId = "cc7cc569-f62c-49b2-9f42-d8852d4e3e7b"; 

    // 3. vendorId ka check hata diya
    if (!message || !sessionId) {
        return next(new ErrorHandler("Please provide message and sessionId", 400));
    }

    // ... baqi neechay ka saara code bilkul same rahega!

    const session = getSession(sessionId);
    session.messages.push({ role: "user", content: message });

    const vendorSchedule = await checkFreeSlots(vendorId);

    const formattedHistory = session.messages
        .map((m) => `${m.role === "user" ? "Customer" : "Dispatcher"}: ${m.content}`)
        .join("\n");

    // Native JSON Mode enable kiya hai taake parse fail na ho
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const businessTimezone = 'Asia/Karachi';
    const businessNow = new Date().toLocaleString('en-US', { timeZone: businessTimezone });

    const prompt = `
You are Alex, a highly efficient, fast, and empathetic AI dispatcher for a 24/7 Locksmith company, chatting live with a customer. Lockouts can be stressful, so keep your tone calm and reassuring.

Vendor's Live Schedule Status: "${vendorSchedule}"
Current Date & Time (${businessTimezone}): ${businessNow}

Your Job Rules:
1. Act like a real human dispatcher — natural, helpful, and concise.
2. Ask for ONLY ONE missing piece of information at a time based on the chat history. Never re-ask for details already provided.
3. Collect these exact details:
   - Customer Name
   - Phone Number
   - Exact Location / Address (Crucial for dispatch)
   - Service Type (Classify as: "Auto", "Residential", or "Commercial")
   - IF Service Type is "Auto": You MUST ask for the Vehicle Make and Model (e.g., 2015 Honda Civic). If it is not Auto, ignore this step.
   - Preferred Appointment Time (or "ASAP" if emergency).
4. STRICT SCHEDULING & FREE SLOT RULE:
   - Look carefully at "Vendor's Live Schedule Status" above. Do not offer booked slots.
   - If requested time is BUSY, REJECT IT politely: "Sorry, [Time] is booked. I have [Offer 2 Free Times]. What works best?"
   - For general requests ("tomorrow morning"), check working hours and suggest two specific free times.
5. EMERGENCY RULE: If the user mentions being locked out in extreme weather, late at night, or a child/pet is locked inside, set "isEmergency" to true immediately and prioritize ASAP dispatch.
6. Set "readyToBook" to true ONLY when you have: Name, Phone, Location, Service Type (and Vehicle Details if Auto), AND an agreed available time.

Return ONLY valid JSON matching this schema:
{
  "reply": "<your natural conversational reply>",
  "extracted": {
    "name": "<string or null>",
    "phone": "<string or null>",
    "address": "<string or null>",
    "issue": "<string or null>",
    "service_type": "<Auto, Residential, Commercial, or null>",
    "vehicle_details": "<year make model or null>",
    "preferredTime": "<e.g., 'Tomorrow at 10:00 AM' or null>",
    "isoStartTime": "<YYYY-MM-DDTHH:mm:ss in BUSINESS LOCAL TIME. No UTC/Z offset. Else null>",
    "isEmergency": <true or false>
  },
  "readyToBook": <true or false>
}

Full conversation history:
${formattedHistory}
    `;

    let parsedData;
    try {
        const result = await model.generateContent(prompt);
        parsedData = JSON.parse(result.response.text());
    } catch (e) {
        console.error("AI Generation / Parsing Error:", e);
        return next(new ErrorHandler("AI response could not be parsed", 500));
    }

    let bookingResult = null;
    let finalReply = parsedData.reply;

  if (parsedData.readyToBook === true && !session.booked) {
        console.log("🎉 All details locked! Attempting to create Google Calendar appointment...");

        // 🚨 NAYA FIX: Agar AI ne time nahi diya (ASAP/Emergency ki wajah se) 
        // toh appointment abhi se 30 minute baad ki set kar do
        if (!parsedData.extracted.isoStartTime) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30); // Add 30 mins for ASAP
            parsedData.extracted.isoStartTime = now.toISOString(); 
        }
        
        console.log("🕒 Time sending to Calendar:", parsedData.extracted.isoStartTime);

        bookingResult = await createEventFromAI(vendorId, parsedData.extracted);

        if (bookingResult) {
            session.booked = true; 

            if (parsedData.extracted.phone) {
                try {
                    let customerId;
                    const aiData = parsedData.extracted;

                    // Details ko safely issue_description me combine kar diya
                    const fullIssueDescription = [
                        aiData.service_type ? `[${aiData.service_type}]` : '',
                        aiData.vehicle_details ? `Vehicle: ${aiData.vehicle_details}` : '',
                        aiData.issue || ''
                    ].filter(Boolean).join(' - ');

                    const { data: existingCustomer } = await supabase
                        .from('customers')
                        .select('id')
                        .eq('phone_number', aiData.phone)
                        .maybeSingle();

                    if (existingCustomer) {
                        customerId = existingCustomer.id;
                        await supabase.from('customers').update({
                            issue_description: fullIssueDescription,
                            address: aiData.address || 'Unknown'
                        }).eq('id', customerId);
                    } else {
                        const { data: newCustomer, error: insertErr } = await supabase
                            .from('customers')
                            .insert([{
                                vendor_id: vendorId,
                                name: aiData.name || 'Unknown',
                                phone_number: aiData.phone,
                                address: aiData.address || 'Unknown',
                                issue_description: fullIssueDescription
                            }])
                            .select('id')
                            .single();

                        if (insertErr) throw insertErr;
                        customerId = newCustomer.id;
                    }

                    if (customerId) {
                        await supabase.from('appointments').insert([{
                            customer_id: customerId,
                            vendor_id: vendorId,
                            slot_time: bookingResult.startTimeISO,
                            google_calendar_event_id: bookingResult.id,
                            status: 'pending',
                            is_emergency: aiData.isEmergency || false
                        }]);
                        console.log("✅ Locksmith Lead Supabase mein Save ho gayi!");
                    }
                } catch (dbError) {
                    console.error("❌ Chatbot Supabase DB Error:", dbError);
                }
            }
        } else {
            console.log("❌ Booking failed — Overriding reply. ❌");
            finalReply = "That time just got taken — what other time works for you?";
        }
    }

    session.messages.push({ role: "assistant", content: finalReply });

    res.status(200).json({
        success: true,
        data: { ...parsedData, reply: finalReply },
        calendarLink: bookingResult ? bookingResult.link : null
    });
});
