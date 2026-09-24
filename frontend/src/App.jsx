import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/meetings";

const initialForm = {
  title: "",
  date: "",
  time: "",
  period: "AM",
  organizer: "",
  participants: "",
  meetingLink: "",
  description: "",
};

function App() {
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET CURRENT DATE
  // ==========================================

  const getToday = () => {
    const now = new Date();

    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  };

  // ==========================================
  // AUTO HIDE SUCCESS MESSAGE
  // ==========================================

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 2000);

    return () => clearTimeout(timer);
  }, [message]);

  // ==========================================
  // AUTO HIDE ERROR MESSAGE
  // ==========================================

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  // ==========================================
  // FETCH MEETINGS
  // ==========================================

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(API_URL);

      if (response.data.success) {
        setMeetings(response.data.data);
      } else {
        setMeetings(response.data.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load meetings.");
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // MEETING TITLE
  // ONLY LETTERS AND SPACES
  // ==========================================

  const handleTitleChange = (e) => {
    const value = e.target.value;

    if (/^[A-Za-z\s]*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        title: value,
      }));
    }
  };

  // ==========================================
  // CONVERT 12 HOUR TIME TO 24 HOUR TIME
  // ==========================================

  const convertTo24Hour = (time, period) => {
    if (!time) {
      return "";
    }

    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours, 10);

    if (period === "AM") {
      if (hour === 12) {
        hour = 0;
      }
    } else {
      if (hour !== 12) {
        hour += 12;
      }
    }

    return `${String(hour).padStart(2, "0")}:${minutes}`;
  };

  // ==========================================
  // CONVERT 24 HOUR TIME TO 12 HOUR TIME
  // ==========================================

  const convertTo12Hour = (time) => {
    if (!time) {
      return {
        time: "",
        period: "AM",
      };
    }

    const cleanTime = time.trim();

    // Handles existing values like:
    // 10:30
    // 10:30 AM
    // 10:30 PM

    if (cleanTime.includes("AM") || cleanTime.includes("PM")) {
      const parts = cleanTime.split(" ");
      const timePart = parts[0];
      const period = parts[1] || "AM";

      return {
        time: timePart,
        period: period,
      };
    }

    const [hours, minutes] = cleanTime.split(":");

    let hour = parseInt(hours, 10);

    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
      hour = 12;
    } else if (hour > 12) {
      hour -= 12;
    }

    return {
      time: `${String(hour).padStart(2, "0")}:${minutes}`,
      period,
    };
  };

  // ==========================================
  // FORMAT TIME FOR DISPLAY
  // ==========================================

  const formatTime = (time) => {
    if (!time) {
      return "";
    }

    const converted = convertTo12Hour(time);

    return `${converted.time} ${converted.period}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // VALIDATE EMAIL
  // ==========================================

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ==========================================
  // SUBMIT FORM
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ------------------------------------------
    // TITLE VALIDATION
    // ------------------------------------------

    const title = formData.title.trim();

    if (!title) {
      alert("Please enter a meeting title.");
      return;
    }

    if (title.length < 3) {
      alert("Meeting title must contain at least 3 characters.");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(title)) {
      alert("Meeting title should contain only letters and spaces.");
      return;
    }

    // ------------------------------------------
    // DATE VALIDATION
    // ------------------------------------------

    if (!formData.date) {
      alert("Please select a meeting date.");
      return;
    }

    // New meetings cannot be created for past dates.
    // Existing past meetings can still be edited.
    if (!editingId && formData.date < getToday()) {
      alert("New meetings cannot be scheduled for a past date.");
      return;
    }

    // ------------------------------------------
    // TIME VALIDATION
    // ------------------------------------------

    if (!formData.time) {
      alert("Please select a meeting time.");
      return;
    }

    // ------------------------------------------
    // ORGANIZER VALIDATION
    // ------------------------------------------

    const organizer = formData.organizer.trim();

    if (!organizer) {
      alert("Please enter organizer email.");
      return;
    }

    if (!isValidEmail(organizer)) {
      alert("Please enter a valid organizer email address.");
      return;
    }

    // ------------------------------------------
    // PARTICIPANTS VALIDATION
    // ------------------------------------------

    const participantEmails = formData.participants
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    if (participantEmails.length === 0) {
      alert("Please enter at least one participant email address.");
      return;
    }

    const invalidParticipants = participantEmails.filter(
      (email) => !isValidEmail(email)
    );

    if (invalidParticipants.length > 0) {
      alert("Please enter valid participant email addresses.");
      return;
    }

    // ------------------------------------------
    // MEETING LINK VALIDATION
    // ------------------------------------------

    const meetingLink = formData.meetingLink.trim();

    if (!meetingLink) {
      alert("Please enter a meeting link.");
      return;
    }

    try {
      new URL(meetingLink);
    } catch {
      alert("Please enter a valid meeting link.");
      return;
    }

    // ------------------------------------------
    // DESCRIPTION VALIDATION
    // ------------------------------------------

    const description = formData.description.trim();

    if (!description) {
      alert("Please enter meeting description.");
      return;
    }

    if (description.length > 50) {
      alert("Description cannot exceed 50 characters.");
      return;
    }

    // ------------------------------------------
    // CONVERT TIME TO 24 HOUR FORMAT
    // ------------------------------------------

    const finalTime = convertTo24Hour(
      formData.time,
      formData.period
    );

    // ------------------------------------------
    // DATA TO SEND TO BACKEND
    // ------------------------------------------

    const meetingData = {
      title,
      date: formData.date,
      time: finalTime,
      organizer,
      participants: participantEmails,
      meetingLink,
      description,
    };

    try {
      setLoading(true);

      if (editingId) {
        // UPDATE
        await axios.put(
          `${API_URL}/${editingId}`,
          meetingData
        );

        setMessage("Meeting updated successfully.");
      } else {
        // CREATE
        await axios.post(API_URL, meetingData);

        setMessage("Meeting created successfully.");
      }

      // Reset form
      setFormData(initialForm);

      // Exit edit mode
      setEditingId(null);

      // Refresh meetings
      await fetchMeetings();

      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      const backendMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT MEETING
  // ==========================================

  const handleEdit = (meeting) => {
    const convertedTime = convertTo12Hour(meeting.time);

    setFormData({
      title: meeting.title || "",
      date: meeting.date || "",
      time: convertedTime.time || "",
      period: convertedTime.period || "AM",
      organizer: meeting.organizer || "",
      participants: Array.isArray(meeting.participants)
        ? meeting.participants.join(", ")
        : "",
      meetingLink: meeting.meetingLink || "",
      description: meeting.description || "",
    });

    setEditingId(meeting._id);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setFormData(initialForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  // ==========================================
  // DELETE MEETING
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this meeting?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      setMessage("Meeting deleted successfully.");
      setError("");

      await fetchMeetings();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(err);

      setError("Unable to delete meeting.");
    }
  };

  // ==========================================
  // CURRENT DATE
  // ==========================================

  const today = getToday();

  // ==========================================
  // TODAY'S MEETINGS
  // ==========================================

  const todaysMeetings = meetings
    .filter((meeting) => meeting.date === today)
    .sort((a, b) => {
      const timeA = a.time || "";
      const timeB = b.time || "";

      return timeA.localeCompare(timeB);
    });

  // ==========================================
  // UPCOMING MEETINGS
  //
  // Includes:
  // TODAY + FUTURE
  //
  // Excludes:
  // PAST
  // ==========================================

  const upcomingMeetings = meetings
    .filter((meeting) => meeting.date >= today)
    .sort((a, b) => {
      const dateA = `${a.date} ${a.time || ""}`;
      const dateB = `${b.date} ${b.time || ""}`;

      return dateA.localeCompare(dateB);
    });

  // ==========================================
  // FILTER UPCOMING MEETINGS
  // ==========================================

  const filteredMeetings = upcomingMeetings.filter((meeting) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      meeting.title?.toLowerCase().includes(searchText) ||
      meeting.organizer?.toLowerCase().includes(searchText) ||
      meeting.description?.toLowerCase().includes(searchText);

    const matchesDate =
      !filterDate || meeting.date === filterDate;

    return matchesSearch && matchesDate;
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setFilterDate("");
  };

  // ==========================================
  // CHARACTER COUNT
  // ==========================================

  const descriptionLength = formData.description.length;

  return (
    <div className="app">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">
        <div>
          <h1>Meeting Management</h1>

          <p>
            Plan, organize and manage your meetings
          </p>
        </div>

        <div className="header-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </header>

      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <main className="container">

        {/* ====================================
            SUCCESS MESSAGE
        ==================================== */}

        {message && (
          <div className="message">
            {message}
          </div>
        )}

        {/* ====================================
            ERROR MESSAGE
        ==================================== */}

        {error && (
          <div
            className="message"
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              borderColor: "#fecaca",
            }}
          >
            {error}
          </div>
        )}

        {/* ====================================
            CREATE / UPDATE FORM
        ==================================== */}

        <section className="form-section">

          <div className="section-title">
            <div>
              <h2>
                {editingId
                  ? "Update Meeting"
                  : "Create Meeting"}
              </h2>

              <p>
                {editingId
                  ? "Update the meeting details"
                  : "Enter the details for your new meeting"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* ==================================
                  MEETING TITLE
              ================================== */}

              <div className="form-group full">

                <label>
                  Meeting Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter meeting title"
                  maxLength={100}
                  required
                />

                <small>
                  Only letters and spaces are allowed
                </small>

              </div>

              {/* ==================================
                  DATE
              ================================== */}

              <div className="form-group">

                <label>
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={!editingId ? getToday() : undefined}
                  required
                />

              </div>

              {/* ==================================
                  TIME
              ================================== */}

              <div className="form-group">

                <label>
                  Time *
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >

                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    style={{
                      flex: 1,
                    }}
                  />

                  <select
                    name="period"
                    value={formData.period}
                    onChange={handleChange}
                    style={{
                      width: "105px",
                      padding: "12px 13px",
                      border: "1px solid #d1d5db",
                      borderRadius: "7px",
                      fontSize: "14px",
                      background: "white",
                      color: "#374151",
                      outline: "none",
                    }}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>

                </div>

              </div>

              {/* ==================================
                  ORGANIZER
              ================================== */}

              <div className="form-group">

                <label>
                  Organizer *
                </label>

                <input
                  type="email"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Enter organizer email"
                  required
                />

              </div>

              {/* ==================================
                  PARTICIPANTS
              ================================== */}

              <div className="form-group">

                <label>
                  Participants *
                </label>

                <input
                  type="text"
                  name="participants"
                  value={formData.participants}
                  onChange={handleChange}
                  placeholder="Enter participant emails"
                  required
                />

                <small>
                  Separate multiple emails with commas
                </small>

              </div>

              {/* ==================================
                  MEETING LINK
              ================================== */}

              <div className="form-group full">

                <label>
                  Meeting Link *
                </label>

                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="Enter meeting link"
                  required
                />

              </div>

              {/* ==================================
                  DESCRIPTION
              ================================== */}

              <div className="form-group full">

                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter meeting description"
                  rows="5"
                  maxLength={50}
                  required
                />

                <small>
                  {descriptionLength}/50 characters
                </small>

              </div>

            </div>

            {/* ==================================
                FORM BUTTONS
            ================================== */}

            <div className="form-buttons">

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Meeting"
                  : "Create Meeting"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* ======================================
            TODAY'S MEETINGS
        ====================================== */}

        <section className="meetings-section">

          <div className="section-title">

            <div>
              <h2>
                Today's Meetings
              </h2>

              <p>
                Meetings scheduled for today
              </p>
            </div>

            <div className="count">
              {todaysMeetings.length}
            </div>

          </div>

          {todaysMeetings.length === 0 ? (

            <div className="empty">
              No meetings scheduled for today.
            </div>

          ) : (

            <div className="meeting-grid">

              {todaysMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              ))}

            </div>

          )}

        </section>

        {/* ======================================
            UPCOMING MEETINGS
        ====================================== */}

        <section className="meetings-section">

          <div className="section-title">

            <div>
              <h2>
                Upcoming Meetings
              </h2>

              <p>
                Today's and future meetings
              </p>
            </div>

            <div className="count">
              {filteredMeetings.length}
            </div>

          </div>

          {/* ====================================
              FILTERS
          ==================================== */}

          <div className="filters">

            <div className="search-box">

              <input
                type="text"
                placeholder="Search meetings..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="date-filter">

              <input
                type="date"
                value={filterDate}
                onChange={(e) =>
                  setFilterDate(e.target.value)
                }
              />

            </div>

            {(search || filterDate) && (
              <button
                type="button"
                className="clear-btn"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}

          </div>

          {/* ====================================
              MEETING LIST
          ==================================== */}

          {filteredMeetings.length === 0 ? (

            <div className="empty">

              {search || filterDate
                ? "No meetings match your filters."
                : "No upcoming meetings."}

            </div>

          ) : (

            <div className="meeting-grid">

              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting._id}
                  meeting={meeting}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

// ==================================================
// MEETING CARD COMPONENT
// ==================================================

function MeetingCard({
  meeting,
  onEdit,
  onDelete,
  formatDate,
  formatTime,
}) {
  return (
    <div className="meeting-card">

      {/* ============================================
          CARD HEADER
      ============================================ */}

      <div className="card-header">

        <div>

          <h3>
            {meeting.title}
          </h3>

          <div className="meeting-date">
            {formatDate(meeting.date)}
          </div>

        </div>

        <div className="time">
          {formatTime(meeting.time)}
        </div>

      </div>

      {/* ============================================
          CARD BODY
      ============================================ */}

      <div className="card-body">

        {/* ORGANIZER */}

        <div className="detail">

          <strong>
            Organizer
          </strong>

          <span>
            {meeting.organizer}
          </span>

        </div>

        {/* PARTICIPANTS */}

        <div className="detail">

          <strong>
            Participants
          </strong>

          <span>
            {Array.isArray(meeting.participants)
              ? meeting.participants.join(", ")
              : meeting.participants}
          </span>

        </div>

        {/* DESCRIPTION */}

        <div className="detail">

          <strong>
            Description
          </strong>

          <span>
            {meeting.description}
          </span>

        </div>

        {/* MEETING LINK */}

        <div className="detail">

          <strong>
            Meeting Link
          </strong>

          <a
            href={meeting.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="meeting-link"
          >
            Join Meeting
          </a>

        </div>

      </div>

      {/* ============================================
          CARD ACTIONS
      ============================================ */}

      <div className="card-actions">

        <button
          type="button"
          className="edit-btn"
          onClick={() => onEdit(meeting)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(meeting._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default App;