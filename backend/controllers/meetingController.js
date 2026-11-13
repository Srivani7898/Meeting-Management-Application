const Meeting = require("../models/Meeting");
const {
    sendMeetingNotification
} = require("../services/emailService");


// CREATE MEETING
const createMeeting = async (req, res) => {
    try {
        const { date } = req.body;

        // Prevent creating meetings for a past date
        const today = new Date().toISOString().split("T")[0];

        if (date < today) {
            return res.status(400).json({
                success: false,
                message: "New meetings cannot be scheduled for a past date"
            });
        }

        // Save meeting to MongoDB
        const meeting = await Meeting.create(req.body);

        // Send email notification to organizer and participants
        try {
            await sendMeetingNotification(meeting);

            res.status(201).json({
                success: true,
                message:
                    "Meeting created successfully and notification emails sent",
                data: meeting
            });

        } catch (emailError) {
            console.error(
                "Email notification failed:",
                emailError.message
            );

            // Meeting was created successfully even if email fails
            res.status(201).json({
                success: true,
                message:
                    "Meeting created successfully, but email notification could not be sent",
                data: meeting
            });
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL MEETINGS
const getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({
            date: 1,
            time: 1
        });

        res.status(200).json({
            success: true,
            count: meetings.length,
            data: meetings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE MEETING
const getMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid meeting ID"
        });
    }
};


// UPDATE MEETING
const updateMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            data: meeting
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE MEETING
const deleteMeeting = async (req, res) => {
    try {
        const meeting = await Meeting.findByIdAndDelete(
            req.params.id
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid meeting ID"
        });
    }
};


module.exports = {
    createMeeting,
    getMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting
};