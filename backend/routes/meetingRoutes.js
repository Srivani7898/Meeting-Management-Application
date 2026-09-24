const express = require("express");

const {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/", createMeeting);

router.get("/", getMeetings);

router.get("/:id", getMeeting);

router.put("/:id", updateMeeting);

router.delete("/:id", deleteMeeting);

module.exports = router;