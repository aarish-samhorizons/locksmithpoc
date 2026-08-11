// import { GoogleGenerativeAI } from '@google/generative-ai';
// import twilio from 'twilio';
// import supabase from '../db/supabase.js'; 
// import { checkFreeSlots, createEventFromAI } from './calendarController.js'; 
// import dotenv from 'dotenv';
// dotenv.config();

// // 🔥 Top Setup: Gemini + Twilio Direct Client
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// const twilioWhatsAppNumber = 'whatsapp:+14155238886';

// // 1. Function Calling Tool Setup
// const hvacTools = {
//     functionDeclarations: [
//         {
//             name: "book_appointment",
//             description: "Use this function ONLY when you have collected all required details: customer name, appointment date, preferred time, exact address, and issue description.",
//             parameters: {
//                 type: "OBJECT",
//                 properties: {
//                     name: { type: "STRING", description: "Customer's full name" },
//                     date: { type: "STRING", description: "Appointment Date (e.g. YYYY-MM-DD or DD-Month-YYYY)" },
//                     time: { type: "STRING", description: "Appointment Time (e.g. 10:00 AM or 02:00 PM)" },
//                     issue: { type: "STRING", description: "The HVAC issue (e.g. AC leaking, blowing warm air)" },
//                     address: { type: "STRING", description: "Customer's exact residential address" }
//                 },
//                 required: ["name", "date", "time", "issue", "address"]
//             }
//         }
//     ]
// };

// const waSessions = new Map();

// export const handleWhatsAppMessage = async (req, res) => {
//     try {
//         const incomingMsg = req.body.Body;
//         const senderNumber = req.body.From; // e.g. "whatsapp:+923034018901"

//         // Clean phone number for database queries (+923034018901)
//         const cleanPhone = senderNumber.replace('whatsapp:', '').trim();

//         console.log(`\n📩 WhatsApp Msg from ${cleanPhone}: "${incomingMsg}"`);

//         const todayDate = new Date().toDateString();
//         const vendorId = "feabc10c-a78b-4288-bb54-50cd78e0145d"; 

//         // Live Calendar Free Slots Fetching
//         const calendarStatus = await checkFreeSlots(vendorId);

//         // 2. AI Model setup
//         const model = genAI.getGenerativeModel({ 
//             model: "gemini-flash-latest",
//             tools: [hvacTools],
//             systemInstruction: `You are Alex, a warm, polite, and highly responsive human AI dispatcher for an HVAC service team on WhatsApp.
// Today's date is: ${todayDate}.

// 🚨 LIVE CALENDAR SCHEDULE STATUS:
// ${calendarStatus}

// RULES FOR CHATTING:
// 1. Speak naturally like a friendly customer support representative. Keep replies brief (1 to 2 sentences max).
// 2. STRICT CALENDAR RULE: NEVER accept or offer slots that are listed as BUSY/BOOKED. If a customer asks for a booked time, politely inform them it's unavailable and suggest 2 open slots from the calendar status.
// 3. Collect missing details one by one (Name, Address, Issue, Preferred Time).
// 4. As soon as you have all 5 details locked and agreed upon, call the 'book_appointment' function immediately.`
//         });

//         let chat;
//         if (!waSessions.has(senderNumber)) {
//             chat = model.startChat();
//             waSessions.set(senderNumber, chat);
//         } else {
//             chat = waSessions.get(senderNumber);
//         }

//         let result = await chat.sendMessage(incomingMsg);
//         let response = result.response;
//         let aiReply = "";

//         const functionCalls = response.functionCalls();
        
//         if (functionCalls && functionCalls.length > 0) {
//             const call = functionCalls[0];
            
//             if (call.name === "book_appointment") {
//                 console.log("\n🚀 AI Triggered Tool: book_appointment");
//                 const aiData = call.args;

//                 aiData.phone = cleanPhone;
//                 aiData.preferredTime = aiData.time; 
                
//                 // 3. Create Google Calendar Event
//                 const eventLink = await createEventFromAI(vendorId, aiData);

//                 if (!eventLink) {
//                     const functionResponseResult = await chat.sendMessage([{
//                         functionResponse: {
//                             name: "book_appointment",
//                             response: { success: false, message: "That specific time slot was just taken. Apologize and ask the customer to pick another free time." }
//                         }
//                     }]);
//                     aiReply = functionResponseResult.response.text();
//                 } else {
//                     // 4. Supabase DB Sync
//                     try {
//                         let customerId;

//                         const { data: existingCustomer } = await supabase
//                             .from('customers')
//                             .select('id')
//                             .eq('phone_number', cleanPhone)
//                             .maybeSingle();

//                         if (existingCustomer) {
//                             customerId = existingCustomer.id;
//                             await supabase.from('customers').update({
//                                 issue_description: aiData.issue,
//                                 address: aiData.address
//                             }).eq('id', customerId);
//                         } else {
//                             const { data: newCustomer, error: custError } = await supabase
//                                 .from('customers')
//                                 .insert([{
//                                     phone_number: cleanPhone,
//                                     name: aiData.name,
//                                     address: aiData.address,
//                                     issue_description: aiData.issue,
//                                     vendor_id: vendorId
//                                 }])
//                                 .select('id')
//                                 .single();
                                
//                             if (custError) throw custError;
//                             customerId = newCustomer.id;
//                         }

//                         // Robust Date Parsing
//                         let slotTimeISO;
//                         try {
//                             const parsedDate = new Date(`${aiData.date} ${aiData.time}`);
//                             slotTimeISO = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
//                         } catch (e) {
//                             slotTimeISO = new Date().toISOString();
//                         }

//                         const { error: apptError } = await supabase
//                             .from('appointments') 
//                             .insert([{
//                                 customer_id: customerId,
//                                 vendor_id: vendorId,
//                                 slot_time: slotTimeISO,
//                                 google_calendar_event_id: eventLink,
//                                 status: 'Pending'
//                             }]);

//                         if (apptError) throw apptError;
//                         console.log("✅ Supabase Customer & Appointment Records Saved!");

//                     } catch (dbError) {
//                         console.error("❌ Supabase Insertion Error:", dbError);
//                     }

//                     const functionResponseResult = await chat.sendMessage([{
//                         functionResponse: {
//                             name: "book_appointment",
//                             response: { success: true, message: "Appointment successfully scheduled in Google Calendar and DB. Confirm warmly to the customer." }
//                         }
//                     }]);
//                     aiReply = functionResponseResult.response.text();
//                 }
//             }
//         } else {
//             aiReply = response.text();
//         }

//         console.log(`🤖 Alex (AI): ${aiReply}`);

//         // 🔥 YAHAN THA ASAL MAGIC: TwiML XML Hata Kar Direct API Lagayi
//         try {
//             await twilioClient.messages.create({
//                 body: aiReply,
//                 from: twilioWhatsAppNumber,
//                 to: senderNumber // WhatsApp par direct hit
//             });
//             console.log("✅ Message direct WhatsApp par deliver ho gaya!");
//         } catch (twErr) {
//             console.error("❌ Twilio Direct Send Error:", twErr.message);
//         }

//         // Twilio Webhook ko 200 OK bhej diya taake wo timeout na kare
//         res.status(200).send('<Response></Response>');

//     } catch (error) {
//         console.error("❌ WhatsApp Webhook Error:", error);
//         res.status(500).send("Server Error");
//     }
// };