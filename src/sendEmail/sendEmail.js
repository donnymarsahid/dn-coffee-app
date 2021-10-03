const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendResetLink(email, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const options = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(options, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("email send successfully");
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendResetLink;
