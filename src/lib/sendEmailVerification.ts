import { functions } from "@/firebase/firebaseConfig";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: import.meta.env.EMAIL_USER,
    pass: import.meta.env.EMAIL_PASS,
  },
});

exports.sendEmailVerification = functions.https.onCall(
  async (data, context) => {
    const { email, code } = data;

    const mailOptions = {
      from: "Your Name <your_email@gmail.com>",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${code}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError("internal", "Failed to send email.");
    }
  }
);
