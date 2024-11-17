const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter (service that will send email like (gmail, mailgun , sendgrid))
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options (subject, email, message)
  const mailOptions = {
    from: "E-Shop App <e-commerceteam@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
