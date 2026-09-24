const Meeting = require("../models/Meeting");

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

        const meeting = await Meeting.create(req.body);

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });
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
        const meeting = await Meeting.findByIdAndDelete(req.params.id);

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