const EmailHelper = require('./util/EmailHelper');

// Test values
const templateName = 'otp.html'; // Make sure this template exists in util/email_templates
const receiverEmail = process.env.EMAIL_FROM; // Send to yourself for testing
const creds = {
  name: 'Test User',
  otp: Math.floor(100000 + Math.random() * 900000).toString(),
};

EmailHelper(templateName, receiverEmail, creds)
  .then(() => console.log('Test email sent!'))
  .catch((err) => console.error('Error sending test email:', err));
