const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const { getMatches } = require("../controllers/matchController");


// 🔥 GET ALL MATCHED USERS (CHAT LIST)
router.get("/", authMiddleware, getMatches);

module.exports = router;