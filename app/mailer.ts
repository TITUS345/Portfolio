import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendAdminNotification(userEmail: string) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Portfolio System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: 'New User Sign Up Notification',
    text: `A new user has signed up on your portfolio: ${userEmail}`,
    html: `<b>New User Sign Up:</b> <p>${userEmail}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: `"Portfolio System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Login Verification Code',
    text: `Your verification code is: ${code}`,
    html: `<b>Verification Code:</b> <p>${code}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}