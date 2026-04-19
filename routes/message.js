const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const { 
  sendMessage, 
  getMessages 
} = require("../controllers/messageController");

// 🔥 Send
router.post("/send", authMiddleware, sendMessage);

// 🔥 Get chat
router.get("/:userId", authMiddleware, getMessages);

module.exports = router;