import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        console.log('--- SEND EMAIL DEBUG ---');
        console.log(`Host: ${process.env.EMAIL_HOST}`);
        console.log(`Port: ${process.env.EMAIL_PORT} (parsed: ${parseInt(process.env.EMAIL_PORT)})`);
        console.log(`Secure: ${process.env.EMAIL_SECURE} (evaluated: ${process.env.EMAIL_SECURE === 'true'})`);
        console.log(`User: ${process.env.EMAIL_USER}`);

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;
