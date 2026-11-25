const express = require("express");
const mongoose = require("mongoose");
const Application = require("../models/Application");

const router = express.Router();

const checkId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  next();
};

// CREATE
router.post("/", async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all  (optional filter: /api/applications?status=Interview)
router.get("/", async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ one
router.get("/:id", checkId, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", checkId, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ message: "Not found" });
    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", checkId, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
