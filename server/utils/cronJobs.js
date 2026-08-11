// import cron from 'node-cron';
// import twilio from 'twilio';
// import { DateTime } from 'luxon';
// import supabase from '../db/supabase.js'; 
// import { checkFreeSlots } from '../controller/calendarController.js'; 
// import dotenv from 'dotenv';
// dotenv.config();

// const twilioClient = twilio("ACa3ad9094897bf162976518c72b4c90e5", "d668a61a504cffa1a09c03dbbfc8d5ef");
// const twilioWhatsAppNumber = 'whatsapp:+14155238886'; 

// // Helper: Custom AC Care Tips Generator (Issue ke hisaab se hidayat)
// const getCareTips = (issue = "") => {
//     const lowerIssue = issue.toLowerCase();
//     if (lowerIssue.includes("water") || lowerIssue.includes("leak")) {
//         return "💡 *AC Care Tip:* Please check your drain pipe monthly for dust clogs to prevent water leakage in the future.";
//     } else if (lowerIssue.includes("cool") || lowerIssue.includes("warm") || lowerIssue.includes("gas")) {
//         return "💡 *AC Care Tip:* Keep your air filters clean every 2 weeks. Clean filters save 15% electricity and give ice-cold air!";
//     } else {
//         return "💡 *AC Care Tip:* Always run your AC on Auto-fan mode and get the outdoor condenser coil washed every season.";
//     }
// };

// // Helper: Busy slots ke string se 3 FREE SLOTS alag nikaalna
// const getThreeFreeSlots = (busyScheduleString = "") => {
//     const defaultHours = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];
//     const freeSlots = defaultHours.filter(time => !busyScheduleString.includes(time.slice(0, 2)));
//     return freeSlots.slice(0, 3).join(", ") || "09:00 AM, 11:30 AM, 03:00 PM";
// };

// const sendWhatsAppMsg = async (toNumber, message) => {
//     try {
//         const formattedNumber = toNumber.startsWith('whatsapp:') ? toNumber : `whatsapp:${toNumber}`;
//         await twilioClient.messages.create({
//             body: message,
//             from: twilioWhatsAppNumber,
//             to: formattedNumber
//         });
//         console.log(`✅ Message sent successfully to ${formattedNumber}`);
//     } catch (error) {
//         console.error("❌ Twilio Send Error:", error.message || error);
//     }
// };

// export const startCronJobs = () => {
//     // 🔥 TESTING SCHEDULE: Har 1 minute chalega
//     cron.schedule('* * * * *', async () => {
//         console.log("\n⏰ [CRON JOB] Checking appointments for Review & Maintenance...");

//         try {
//             const { data: appointments, error } = await supabase
//                 .from('appointments')
//                 .select(`
//                     id,
//                     created_at,
//                     slot_time,
//                     vendor_id,
//                     review_sent,
//                     maintenance_sent,
//                     customers ( name, phone_number, issue_description )
//                 `);

//             if (error) throw error;

//             const now = DateTime.now().setZone('Asia/Karachi');

//             for (const appt of appointments) {
//                 if (!appt.customers?.phone_number) continue;

//                 // 🔥 TESTING TIME MATH: Hum created_at se MINUTES calculate kar rahe hain
//                 const createdDate = DateTime.fromISO(appt.created_at || appt.slot_time).setZone('Asia/Karachi');
//                 const diffMinutes = Math.floor(now.diff(createdDate, 'minutes').minutes);

//                 const phone = appt.customers.phone_number;
//                 const name = appt.customers.name || "Valued Customer";
//                 const issue = appt.customers.issue_description || "AC HVAC Service";
//                 const careTip = getCareTips(issue);

//                 // ==========================================
//                 // 1️⃣ TESTING: 1 MINUTE BAAD REVIEW MESSAGE
//                 // ==========================================
//                 if (diffMinutes >= 1 && !appt.review_sent) {
//                     console.log(`💬 Sending Customized Review Ask to ${name} for issue: "${issue}"`);
                    
//                     const reviewMsg = `Hello ${name}! 🛠️\n\nOur technician recently resolved your HVAC issue regarding: *" ${issue} "*. We hope everything is working perfectly now!\n\n${careTip}\n\n🌟 *Did you like our service?* Please reply with a 5-STAR rating (⭐⭐⭐⭐⭐) or tell us how we can improve. Your feedback means the world to us!`;
                    
//                     await sendWhatsAppMsg(phone, reviewMsg);

//                     // DB Lock: Message dobara na jaye
//                     await supabase.from('appointments').update({ review_sent: true }).eq('id', appt.id);
//                 }

//                 // ==========================================
//                 // 2️⃣ TESTING: 2 MINUTE BAAD INSPECTION + 3 LIVE FREE SLOTS OFFER
//                 // ==========================================
//                 else if (diffMinutes >= 2 && appt.review_sent && !appt.maintenance_sent) {
//                     console.log(`🛠️ Fetching Live Calendar Slots & Sending 1-Month Inspection Offer to ${name}...`);
                    
//                     // Google Calendar se Live Busy Slots mangwa rahe hain
//                     const scheduleStatus = await checkFreeSlots(appt.vendor_id || "feabc10c-a78b-4288-bb54-50cd78e0145d");
                    
//                     // Busy list se 3 clean Free Slots nikaal rahe hain
//                     const threeSlots = getThreeFreeSlots(scheduleStatus);
                    
//                     const maintenanceMsg = `Hi ${name}! ⏳\n\nIt feels like a month has already passed since we fixed your AC! Regular maintenance checks can save you up to 50% on major repair costs and keep your cooling bills low.\n\n📅 *We checked our technician's live availability for tomorrow and have these FREE slots:* \n👉 *[ ${threeSlots} ]*\n\nWould you like me to lock in a routine inspection slot for you right now? Just reply with your preferred time (e.g. *"Book 11:30 AM"*) or call us anytime!`;
                    
//                     await sendWhatsAppMsg(phone, maintenanceMsg);

//                     // DB Lock: Message dobara na jaye
//                     await supabase.from('appointments').update({ maintenance_sent: true }).eq('id', appt.id);
//                 }
//             }
//             console.log("✅ Cron Cycle Complete!");

//         } catch (error) {
//             console.error("❌ Cron Job Error:", error);
//         }
//     });
// };