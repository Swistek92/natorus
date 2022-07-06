const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1 create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    logger: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // service: 'Gmail',
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    // activate in gmail less secure app option
  });

  //2 define the email options
  const mailOptions = {
    from: 'piotr piotr <piotr@piotr.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  //3 actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
