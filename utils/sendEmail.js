import nodeMailer from "nodemailer";

export const sendEmail = async (options) => {
  // Validate required SMTP environment variables early and clearly
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_MAIL", "SMTP_PASSWORD"];
  const missingEnv = required.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    throw new Error(`Missing SMTP env variables: ${missingEnv.join(", ")}`);
  }

  // Normalize SMTP port and password (strip spaces that sometimes appear in app-passwords)
  const port = Number(process.env.SMTP_PORT);
  const rawPassword = process.env.SMTP_PASSWORD || "";
  const pass = rawPassword.replace(/\s+/g, "");

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // use TLS for port 465
    ...(process.env.SMTP_SERVICE ? { service: process.env.SMTP_SERVICE } : {}),
    auth: {
      user: process.env.SMTP_MAIL,
      pass,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: `${options.message} \n\nEmail of User Who Sent The Message: ${options.userEmail}`,
  };

  try {
    // Verify transporter configuration in dev to get clearer errors early
    await transporter.verify();
  } catch (verifyError) {
    // provide a clearer error message for logs
    console.error("Mail transporter verification failed:", verifyError.message || verifyError);
    throw verifyError;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info && info.messageId ? info.messageId : info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error && error.message ? error.message : error);
    throw error;
  }
};

// Export a helper to verify SMTP config without sending an email
export const verifySMTP = async () => {
  const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_MAIL", "SMTP_PASSWORD"];
  const missingEnv = required.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    throw new Error(`Missing SMTP env variables: ${missingEnv.join(", ")}`);
  }

  const port = Number(process.env.SMTP_PORT);
  const rawPassword = process.env.SMTP_PASSWORD || "";
  const pass = rawPassword.replace(/\s+/g, "");

  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    ...(process.env.SMTP_SERVICE ? { service: process.env.SMTP_SERVICE } : {}),
    auth: { user: process.env.SMTP_MAIL, pass },
  });

  await transporter.verify();
  return true;
};