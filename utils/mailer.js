// backend/utils/mailer.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true para 465, false para otros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNotificationEmail = async ({ name, email, message }) => {
  await transporter.sendMail({
    from: `"Portafolio Web" <${process.env.EMAIL_USER}>`,
    to: process.env.DEST_EMAIL,
    subject: '📩 Nuevo mensaje desde tu portafolio',
    html: `
      <h2>Nuevo mensaje recibido</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  });
};

module.exports = sendNotificationEmail;
