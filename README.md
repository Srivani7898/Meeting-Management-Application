# Meeting Management Application

A full-stack Meeting Management Application built using the MERN stack. It allows users to register, log in, schedule meetings, manage meeting details, and receive email notifications.

## 🚀 Features

- **User Authentication:** User registration and login.
- **Meeting Creation:** Schedule meetings with title, date, time, organizer, participants, meeting link, and description.
- **Meeting Management:** Create, view, update, and delete meetings.
- **Today's Meetings:** View meetings scheduled for the current day.
- **Upcoming Meetings:** View upcoming scheduled meetings.
- **Past Meetings:** View previously completed meetings.
- **Form Validation:** Validate meeting details and prevent scheduling meetings on past dates.
- **Email Notifications:** Automatically send email notifications to organizers and participants when a meeting is created.
- **Logout:** Securely log out of the application.

## 🛠️ Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

**Development Tools**
- Visual Studio Code
- Git and GitHub
- Postman
- MongoDB Community Server

## 📁 Project Structure

```text
meeting-management/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Srivani7898/Meeting-Management-Application.git
```

### 2. Navigate to the project directory

```bash
cd Meeting-Management-Application
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder.

Add the required configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

Use the exact variable names expected by your backend code. Never upload your actual `.env` file to GitHub.

### 5. Start the backend server

```bash
npm start
```

Use `npm run dev` instead if your backend uses nodemon.

### 6. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## 💡 Application Workflow

1. Register a new user account.
2. Log in using your credentials.
3. Access the meeting dashboard.
4. Create a meeting by entering the required details.
5. Organizers and participants receive email notifications.
6. View today's, upcoming, and past meetings.
7. Update or delete meetings when required.
8. Log out of the application.

## 🔮 Future Enhancements

- Calendar integration.
- Meeting reminders.
- Role-based access control.
- Video conferencing integration.
- Meeting search and filtering.


---

⭐ If you find this project useful, feel free to explore and contribute!
