const nodemailer = require("nodemailer");
require("dotenv").config();
const generateToken = require("../config/generateToken");
const template = require("../views/forgotPassword.html")


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

const sendForgotPassEmail = async ({ _id, name, email }) => {
    try {
      const url = "http://localhost:5000";
      const token = generateToken(_id);
      const link = `<a href="${url}/api/user/reset-password?uniqueString=${token}&userId=${_id}">here</a>`
  
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Forgot Password",
        html: template(name, link )
    
      };
  
      await transporter.sendMail(mailOptions);
  
      const verificationLink = `${url}/api/user/reset-password?uniqueString=${token}&userId=${_id}`;
  
      return verificationLink;
    } catch (error) {
      console.log(error);
      throw new Error("An error occurred while sending the confirmation email");
    }
  };

  module.exports = sendForgotPassEmail;
