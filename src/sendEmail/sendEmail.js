const nodemailer = require("nodemailer");
require("dotenv").config();
const { transaction, user } = require("../../models");

async function sendResetLink(email, subject, link, fullname) {
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
      html: ` <div style="background-color: #f6f6f6; height: 400px; padding: 35px; font-family: sans-serif; color: #3d3d3d">
      <div style="background-color: white; padding: 10px 25px">
        <h3>Hi, ${fullname}</h3>
        <p>You just made a password reset request. If that's you, please change your password by clicking the button below :</p>
        <p>Password reset is only valid for 1x24 hours after this email was sent.</p>
        <div style="display: flex; justify-content: center; margin-top: 30px">
          <a href=${link} style="background-color: rgb(189, 7, 7); color: white; font-weight: 500; text-decoration: none; padding: 10px; border-radius: 5px">Reset Password</a>
        </div>
      </div>
    </div>`,
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

async function sendStatusPayment(orderId, status) {
  try {
    console.log("hello world " + orderId);

    const data = await transaction.findOne({
      where: {
        id: orderId,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },
      ],
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const options = {
      from: process.env.EMAIL,
      to: data.user.email,
      subject: "Payment Status",
      html: `<div>
        <ul>
            <li>${data.user.fullname}</li>
            <li>${data.user.email}</li>
            <li>${orderId}</li>
            <li>${status}</li>
        </ul>
      </div>`,
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

const sendMailFunction = {
  sendResetLink,
  sendStatusPayment,
};

module.exports = sendMailFunction;
