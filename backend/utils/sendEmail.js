import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    console.log(`Initialising email transport: ${process.env.EMAIL_HOST}:587 (Secure: false)`);

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        logger: true, // Log SMTP traffic to console
        debug: true,  // Include debug output
        connectionTimeout: 25000, // 25 seconds
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
