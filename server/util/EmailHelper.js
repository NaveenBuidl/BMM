const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();


const { SENDGRID_API_KEY } = process.env;


function replaceContent(content, creds) {
  let allKeysArr = Object.keys(creds);
  allKeysArr.forEach(function (key) {
    content = content.replace(`#{${key}}`, creds[key]);
  });
  return content;
}


async function EmailHelper(templateName, receiverEmail, creds) {
  try {
    const templatePath = path.join(__dirname, "email_templates", templateName);
    let content = await fs.promises.readFile(templatePath, "utf-8");


    // Determine subject based on template
    let subject = "Mail from Scaler Shows";
    if (templateName === "ticketTemplate.html") {
      subject = `🎬 Booking Confirmed - ${creds.movie} | ${creds.theatre}`;
    } else if (templateName === "otp.html") {
      subject = "Password Reset OTP - Scaler Shows";
    }


    const emailDetails = {
      to: receiverEmail,
      from: process.env.EMAIL_FROM,
      subject: subject,
      text: templateName === "otp.html"
        ? `Hi ${creds.name}, this is your reset otp ${creds.otp}`
        : `Hi ${creds.name}, your booking has been confirmed for ${creds.movie}`,
      html: replaceContent(content, creds),
    };


    const transportDetails = {
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: SENDGRID_API_KEY,
      },
    };


    const transporter = nodemailer.createTransport(transportDetails);
    const result = await transporter.sendMail(emailDetails);
    console.log(`Email sent successfully to ${receiverEmail} - Subject: ${subject}`);
    return result;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}


module.exports = EmailHelper;
