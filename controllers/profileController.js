const express = require("express");
const Profile = require("../models/Profile");

// GET MY PROFILE
  const jwt = require("jsonwebtoken");

const getMyProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "secretkey");

    const profile = await Profile.findOne({ userId: decoded.id });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const updated = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROFILE
const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProfileById = async (req, res) => {
  try {
    const user = await Profile.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "User not found" });
  }
};


module.exports = {
  getMyProfile,
  updateProfile,
  deleteProfile,
  getProfileById
};