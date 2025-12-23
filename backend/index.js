
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const app = express()

app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL, }));

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

mongoose.connect(process.env.MONGO_URI)
.then(function () {
  console.log("Connected to MongoDB")
}).catch(function () {
  console.log("Connection failed")
})

/* =====================
   API Route (SendGrid)
===================== */

app.post("/sendmail", async (req, res) => {
  const { msg, emailList } = req.body;

  if (!msg || !emailList || emailList.length === 0) {
    return res.status(400).send(false);
  }

  try {
    const messages = emailList.map((email) => ({
      to: email,
      from: "sowbaranikaa4@gmail.com", // MUST be verified in SendGrid
      subject: "Bulk Email from BulkMail App",
      text: msg,
    }));

    await sgMail.send(messages);
    console.log("All emails sent successfully");

    res.send(true);
  } catch (error) {
    console.error(error.response?.body || error.message);
    res.send(false);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

































// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// /* =====================
//    App Configuration
// ===================== */

// const app = express();

// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000/",
//   })
// );

// /* =====================
//    SendGrid Setup (ONCE)
// ===================== */

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// /* =====================
//    MongoDB Connection
// ===================== */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("MongoDB error:", err));

// /* =====================
//    Email Send Function
// ===================== */

// const sendMails = async ({ message, emailList }) => {
//   try {
//     const promises = emailList.map((recipient) =>
//       sgMail.send({
//         to: recipient,
//         from: "sowbaranikaa4@gmail.com", // MUST be verified in SendGrid
//         subject: "You got a message from BulkMail App",
//         text: message,
//       })
//     );

//     await Promise.all(promises);
//     console.log("All emails sent successfully");
//     return true;
//   } catch (error) {
//     console.error(
//       "Email send error:",
//       error.response?.body || error.message
//     );
//     return false;
//   }
// };

// /* =====================
//    API Route
// ===================== */

// app.post("/sendmail", async (req, res) => {
//   const { msg, emailList } = req.body;

//   if (!msg || !emailList || emailList.length === 0) {
//     return res.status(400).send(false);
//   }

//   const result = await sendMails({
//     message: msg,
//     emailList,
//   });

//   res.status(result ? 200 : 500).send(result);
// });

// /* =====================
//    Export for Vercel
// ===================== */

// export default app;
