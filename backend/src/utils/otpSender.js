import  nodemailer from "nodemailer"

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `https://yourapp.com/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"Your App" <your@email.com>',
    to: email,
    subject: "Email Verification",
    html: `<h2>Welcome!</h2><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};
