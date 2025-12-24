
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const app = express()

app.use(express.json())
app.use(cors());

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






























