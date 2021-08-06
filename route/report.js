const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Comment = require("../model/Comment");
const Report = require("../model/Report");
const isAuthentificated = require("../midelware/isAuthentificated");

router.post("/report/publish", isAuthentificated, async (req, res) => {
  console.log("/report/publish");
  try {
    const { complaint, type, userIdRepoted, reportId } = req.fields;
    if ((complaint, type, reportId)) {
      const date = new Date();
      const report = new Report({
        reportId: reportId,
        userIdReported: userIdRepoted,
        owner: req.user._id,
        status: "unProcessed",
        type: type,
        complaint: complaint,
        date: {
          dateNow: Date.now(),
          year: date.getFullYear(),
          mouth: date.getMonth() + 1,
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
        },
      });
      report.save();
      res.status(200).json({ message: "report posted", data: report });
    } else {
      res.status(400).json({ message: "field missing" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post(
  "/report/user-all-report-publish",
  isAuthentificated,
  async (req, res) => {
    console.log("route : /report/user-all");
    try {
      const reports = await Report.find({ owner: req.user._id });
      res.status(200).json({ message: "all the report user", data: reports });
    } catch (error) {
      res.status(400).json(error.message);
    }
  }
);
//add user status admin or staff or supremeLeader
router.put("/report/analyse/:id", async (req, res) => {
  console.log("route : /report/analyse/:id");
  try {
    const id = req.params.id;
    const report = await Report.findById(id);
    report.status = "analyse";
    report.save();
    res.status(200).json({ message: "analysing report", data: report });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.put("/report/processed/:id", async (req, res) => {
  console.log("route : /report/processed/:id");
  try {
    const id = req.params.id;
    const responseText = req.fields.responseText;
    if (responseText) {
      const report = await Report.findById(id);
      if (report.status === "unProcessed") {
        res
          .status(400)
          .json({ message: "you must analysing a report for processed it" });
      } else if (report.status === "analyse") {
        report.status = "processed";
        report.response = responseText;
        report.save();
        res.status(200).json({ message: "report processed", data: report });
      } else {
        res.status(400).json({ message: "report already processed" });
      }
    } else {
      res.status(400).json({ message: "missing response" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post("/report/user-all-report/:id", async (req, res) => {
  console.log("toute : /report/user-all-report/:id");
  try {
    const id = req.params.id;
    const reports = await Report.find({ userIdReported: id });
    res.status(200).json({ message: "user all report", data: reports });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
module.exports = router;
