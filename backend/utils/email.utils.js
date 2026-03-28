const nodemailer = require("nodemailer");

/**
 * EMAIL SETUP (configure when ready):
 *   EMAIL_USER=your@gmail.com
 *   EMAIL_PASS=your_gmail_app_password  ← NOT your real password!
 *   ADMIN_EMAIL=admin@yourcompany.com
 *
 * Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords
 */

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
};

const sendEmail = async (opts) => {
  const t = getTransporter();
  if (!t) { console.log("📧 Email skipped (not configured):", opts.subject); return; }
  await t.sendMail(opts);
};

/**
 * Send contact form confirmation to the user
 */
const sendContactConfirmationToUser = async ({ name, email, subject }) => {
  await transporter.sendMail({
    from: `"Your Company" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `We received your message – ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Hi ${name}, thanks for reaching out!</h2>
        <p style="color: #555;">We've received your message regarding <strong>${subject}</strong>.</p>
        <p style="color: #555;">Our team will get back to you within <strong>1–2 business days</strong>.</p>
        <br />
        <p style="color: #999; font-size: 13px;">This is an automated confirmation email. Please don't reply to this message.</p>
      </div>
    `,
  });
};

/**
 * Notify admin about new contact form submission
 */
const sendContactNotificationToAdmin = async ({ name, email, phone, subject, message }) => {
  await transporter.sendMail({
    from: `"Website Contact Form" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `📩 New Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone || "Not provided"}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px;">${subject}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555; vertical-align:top;">Message</td><td style="padding: 8px;">${message}</td></tr>
        </table>
        <br />
        <a href="${process.env.FRONTEND_URL}/admin/contact" style="background: #333; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View in Admin Panel</a>
      </div>
    `,
  });
};

/**
 * Send application confirmation to applicant
 */
const sendApplicationConfirmation = async ({ name, email, jobTitle }) => {
  await transporter.sendMail({
    from: `"Careers at Your Company" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Application Received – ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Hi ${name}, your application is in!</h2>
        <p style="color: #555;">Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
        <p style="color: #555;">We'll review your application and reach out if you're shortlisted.</p>
        <br />
        <p style="color: #999; font-size: 13px;">Best of luck! The Hiring Team</p>
      </div>
    `,
  });
};

/**
 * Notify admin about new job application
 */
const sendApplicationNotificationToAdmin = async ({ name, email, phone, jobTitle }) => {
  await transporter.sendMail({
    from: `"Careers Portal" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🧑‍💼 New Application: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">New Job Application</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Applicant</td><td style="padding: 8px;">${name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone</td><td style="padding: 8px;">${phone}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Position</td><td style="padding: 8px;">${jobTitle}</td></tr>
        </table>
        <br />
        <a href="${process.env.FRONTEND_URL}/admin/careers" style="background: #333; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Review Application</a>
      </div>
    `,
  });
};

module.exports = {
  sendContactConfirmationToUser,
  sendContactNotificationToAdmin,
  sendApplicationConfirmation,
  sendApplicationNotificationToAdmin,
};