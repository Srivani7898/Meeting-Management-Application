const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendMeetingNotification = async (meeting) => {
  const recipients = [
    meeting.organizer,
    ...(meeting.participants || [])
  ];

  // Remove duplicate email addresses
  const uniqueRecipients = [
    ...new Set(
      recipients
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  const mailOptions = {
    from: `"Meeting Management" <${process.env.EMAIL_USER}>`,
    to: uniqueRecipients.join(", "),
    subject: `Meeting Created: ${meeting.title}`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 25px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
      ">

        <h2 style="color: #2563eb;">
          Meeting Created Successfully
        </h2>

        <p>
          A new meeting has been scheduled.
        </p>

        <table style="
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        ">

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Meeting Title
            </td>
            <td style="padding: 8px;">
              ${meeting.title}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Date
            </td>
            <td style="padding: 8px;">
              ${meeting.date}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Time
            </td>
            <td style="padding: 8px;">
              ${meeting.time}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Organizer
            </td>
            <td style="padding: 8px;">
              ${meeting.organizer}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Participants
            </td>
            <td style="padding: 8px;">
              ${(meeting.participants || []).join(", ")}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">
              Description
            </td>
            <td style="padding: 8px;">
              ${meeting.description}
            </td>
          </tr>

        </table>

        <div style="margin-top: 25px;">
          <a
            href="${meeting.meetingLink}"
            target="_blank"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #2563eb;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Join Meeting
          </a>
        </div>

        <p style="
          margin-top: 25px;
          color: #6b7280;
          font-size: 13px;
        ">
          This is an automated notification from Meeting Management.
        </p>

      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendMeetingNotification
};