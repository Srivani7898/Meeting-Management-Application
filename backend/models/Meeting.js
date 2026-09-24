const mongoose = require("mongoose");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const titleRegex = /^[A-Za-z\s]+$/;
const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]$/;
const urlRegex = /^https?:\/\/[^\s]+$/;

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      match: [
        titleRegex,
        "Title can contain only letters and spaces"
      ]
    },

    date: {
      type: String,
      required: [true, "Date is required"],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        "Date must be in YYYY-MM-DD format"
      ]
    },

    time: {
      type: String,
      required: [true, "Time is required"],
      match: [
        timeRegex,
        "Time must be in HH:MM format"
      ]
    },

    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
      match: [
        emailRegex,
        "Please enter a valid organizer email"
      ]
    },

    participants: {
      type: [String],
      required: [true, "Participants are required"],
      validate: {
        validator: function (emails) {
          return (
            Array.isArray(emails) &&
            emails.length > 0 &&
            emails.every((email) => emailRegex.test(email.trim()))
          );
        },
        message: "All participants must have valid email addresses"
      }
    },

    meetingLink: {
      type: String,
      required: [true, "Meeting link is required"],
      trim: true,
      match: [
        urlRegex,
        "Please enter a valid meeting URL"
      ]
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [
        50,
        "Description cannot exceed 50 characters"
      ]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Meeting", meetingSchema);