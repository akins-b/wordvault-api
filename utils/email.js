async function sendEmail(to, subject, html) {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
        'accept': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'WordVault', email: process.env.MAIL_FROM },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Brevo Email API error:', response.status, errText);
      throw new Error(`Brevo API Erroe: ${response.status} - ${errText}`);
    } else {
      console.log(`Email sent successfully via Brevo to ${to}`);
    }
  } catch (error) {
    console.error('Failed to send email via Brevo:', error);
  }
}

module.exports = { sendEmail };
