const nodeMailer = require("nodemailer");

module.exports = {
  sendMail: (to, subject, text) => {
    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
      }
    });
    let mailOptions = {
      to: to,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error(error);
      }
      console.log(`Message ${info.messageId} sent: ${info.response}`);
    });
  }
};
