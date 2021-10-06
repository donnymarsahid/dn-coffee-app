const nodemailer = require("nodemailer");
require("dotenv").config();
const { transaction, user } = require("../../models");
const convertRupiah = require("rupiah-format");

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
      html: `<div style="background-color: #f6f6f6; padding: 35px; font-family: sans-serif; color: #3d3d3d">
      <div style="background-color: white; height: 400px; padding: 10px 25px">
        <div style="border-radius: 5px; background-color: rgb(189, 7, 7); color: white; padding: 3px; justify-content: center; display: flex; align-items: center">
          <h3 style="letter-spacing: 1px">Waysbucks Coffee</h3>
        </div>
        <h4>Hi, ${data.user.fullname}</h4>
        <p>Order ID : ${orderId}</p>
        <p>Status Payment : ${status}</p>
        <p>Total : ${convertRupiah.convert(data.total)}</p>
        <p>Check Now : <a href="https://8e10-180-243-2-155.ngrok.io/all-transaction" style="color: rgb(189, 7, 7)">click here!</a></p>
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

const sendMailFunction = {
  sendResetLink,
  sendStatusPayment,
};

module.exports = sendMailFunction;
