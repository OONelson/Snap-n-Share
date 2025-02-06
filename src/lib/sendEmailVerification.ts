import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

admin.initializeApp();

exports.sendEmailVerification = functions.https.onCall(
  corsHandler,
  async (data, context) => {
    const { email, code } = data;

    const { EMAIL_USER, EMAIL_PASS } = import.meta.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
      console.error("Missing environment variables: EMAIL_USER or EMAIL_PASS");
      throw new functions.https.HttpsError(
        "internal",
        "Missing environment variables."
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Your Name <${EMAIL_USER}>`,
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
