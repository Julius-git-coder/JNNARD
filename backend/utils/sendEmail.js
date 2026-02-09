import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const isSecure = process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT == 465;

    console.log(`Initialising email transport: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT} (Secure: ${isSecure})`);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const message = {
        from: `JNARD System <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    try {
        await transporter.sendMail(message);
        console.log(`Email sent successfully to: ${options.email}`);
    } catch (error) {
        console.error('Nodemailer Error:', error);
        throw error; // Re-throw to be caught by controller
    }
};

export default sendEmail;
