const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  updateProfile,
  deleteProfile,
  getProfileById
} = require("../controllers/profileController");


router.get("/my-profile", getMyProfile);
router.put("/my-profile", updateProfile);
router.delete("/my-profile", deleteProfile);
router.get("/:id",getProfileById);



module.exports = router;