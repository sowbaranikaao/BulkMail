import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

/* =====================
   App Configuration
===================== */

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "https://bulk-mail-neon.vercel.app",
  })
);

/* =====================
   SendGrid Setup (ONCE)
===================== */

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* =====================
   MongoDB Connection
===================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

/* =====================
   Email Send Function
===================== */

const sendMails = async ({ message, emailList }) => {
  try {
    const promises = emailList.map((recipient) =>
      sgMail.send({
        to: recipient,
        from: "sowbaranikaa4@gmail.com", // MUST be verified in SendGrid
        subject: "You got a message from BulkMail App",
        text: message,
      })
    );

    await Promise.all(promises);
    console.log("All emails sent successfully");
    return true;
  } catch (error) {
    console.error(
      "Email send error:",
      error.response?.body || error.message
    );
    return false;
  }
};

/* =====================
   API Route
===================== */

app.post("/sendmail", async (req, res) => {
  const { msg, emailList } = req.body;

  if (!msg || !emailList || emailList.length === 0) {
    return res.status(400).send(false);
  }

  const result = await sendMails({
    message: msg,
    emailList,
  });

  res.status(result ? 200 : 500).send(result);
});

/* =====================
   Export for Vercel
===================== */

export default app;
