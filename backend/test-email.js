import 'dotenv/config';
import sendEmail from './utils/sendEmail.js';

async function testEmail() {
    try {
        console.log('Testing email sending with:');
        console.log(`- Host: ${process.env.EMAIL_HOST}`);
        console.log(`- Port: ${process.env.EMAIL_PORT}`);
        console.log(`- User: ${process.env.EMAIL_USER}`);

        await sendEmail({
            email: process.env.EMAIL_USER,
            subject: 'JNARD Email Test',
            message: 'If you receive this, your email configuration is working!',
        });
        console.log('SUCCESS: Email sent!');
        process.exit(0);
    } catch (err) {
        console.error('FAILURE: Email sending failed.');
        console.error(err);
        process.exit(1);
    }
}

testEmail();
