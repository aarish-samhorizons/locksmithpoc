// routes/aiRoutes.js
import express from 'express';
import { qualifyLead } from '../controller/aiController.js';

// 🔥 Naye controller ko import kar liya
// import { handleWhatsAppMessage } from '../controller/messageController.js'; 

const router = express.Router();

// Pehle se mojood route (Website Lead Qualification ke liye)
// Route banega: POST http://localhost:5000/api/v1/ai/qualify
router.post('/qualify', qualifyLead);

// 🔥 Naya Twilio WhatsApp Webhook Route
// Route banega: POST http://localhost:5000/api/v1/ai/whatsapp
// router.post('/whatsapp', handleWhatsAppMessage);

export default router;