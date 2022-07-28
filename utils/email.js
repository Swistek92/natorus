const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.fristName = user.name.split(' ')[0];
    this.url = url;
    this.from = `jonas <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid

      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      fristName: this.fristName,
      url: this.url,
      subject,
    });

    // 2 define email options
    const mailOptions = {
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      from: process.env.EMAIL_FROM,
      // html:
    };
    // if (process.env.NODE_ENV === 'production') {
    //   mailOptions = {
    //     to: this.to,
    //     subject,
    //     html,
    //     text: htmlToText.fromString(html),
    //     from: process.env.EMAIL_FROM,
    //     // html:
    //   };
    // } else {
    //   mailOptions = {
    //     from: this.from,
    //     to: this.to,
    //     subject,
    //     html,
    //     text: htmlToText.fromString(html),
    //     // html:
    //   };
    // }

    // 3 create a trnasport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome To the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

//3 actually send the email
// await transporter.sendMail(mailOptions);
