const nodemailer = require("nodemailer");
require("dotenv").config();

const sendMail = async (user) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Organization</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
    h1, h2, p {
      color: #333333;
      margin-bottom: 20px;
    }
    p {
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome, ${user.firstname}!</h1>
    <h2>You have been added to our organization.</h2>
    <p>
      <strong>Login Credentials:</strong><br>
      Email: ${user.email}<br>
      Password: ${user.password}<br>
      Kindly log in to our portal and change your password for security reasons.
    </p>
    <p>
      If you have any questions or need assistance, feel free to contact us. We're excited to have you on board!
    </p>
    <div class="footer">
      <p>Best regards,<br>
      The Darwinbox Team</p>
    </div>
  </div>
</body>
</html>`;

    let message = {
      from: process.env.SENDER_MAIL,
      to: user.email,
      subject: "DARWINBOX Team",
      html: htmlContent,
    };

    const info = await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

const generateRandomPassword=(length)=> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars.charAt(randomIndex);
  }
  return password;
}

exports.sendMail = sendMail;
exports.generateRandomPassword = generateRandomPassword;
