const nodemailer = require("nodemailer");

module.exports.sendMail = (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_NAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_NAME,
    to: email,
    subject: "Reset password",
    text: `Bạn đang yêu cầu đặt lại mật khẩu, mã otp của bạn là ${otp}. Vui lòng không cung cấp mã này cho bất kỳ ai`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("email sent: ", info.response);
    }
  });
};
