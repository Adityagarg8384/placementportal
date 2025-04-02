import { google } from "googleapis";
import nodemailer from "nodemailer";

const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET = process.env.CLIENTSECRET;
const REDIRECTURL = process.env.REDIRECTURL;
const REFRESHTOKEN = process.env.REFRESHTOKEN;
const GMAIL_REFRESHTOKEN = process.env.GMAIL_REFRESHTOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENTID,
  CLIENTSECRET,
  REDIRECTURL
);

oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESHTOKEN });

export default async function POST(req, res) {
  try {
    const { name, email, reason, message } = req?.body;

    if (!name || !email || !reason || !message) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "adityagarg8384@gmail.com", 
        clientId: CLIENTID,
        clientSecret: CLIENTSECRET,
        refreshToken: REFRESHTOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "adityagarg8384@gmail.com",
      subject: reason,
      text: message,
      replyTo: email,
      html: `
      <div class="font-sans text-base leading-relaxed">
        <h2 class="text-xl font-bold text-gray-800 mb-4">New Message from ${name}</h2>
  
        <p class="mb-2">
          <strong>Email:</strong> ${email}
        </p>

        <p class="mb-2">
          <strong>Subject:</strong> ${reason}
        </p>
  
        <p class="mb-4">
          ${message}
        </p>

        <hr class="border-gray-300 my-4" />

        <p class="text-gray-500 text-sm">
          This email was sent from your contact form.
        </p>
      </div>

      `,
    };

    const result = await transport.sendMail(mailOptions);


    return res.status(200).json({ message: "Email sent successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Some error occurred", error: err?.message });
  }
}
