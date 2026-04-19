const express = require("express");
const router = express.Router();


const { sendInterest, getMyInterests } = require("../controllers/interestController");
const authMiddleware = require("../middleware/auth");
const { getAllInterests } = require("../controllers/interestController");



const {  
  getIncomingInterests,
  updateInterestStatus
} = require("../controllers/interestController");



//my interest
router.post("/send", authMiddleware, sendInterest);
router.get("/my", authMiddleware, getMyInterests);

// incoming interests
router.get("/incoming", authMiddleware, getIncomingInterests);

// accept/reject
router.put("/status/:id", authMiddleware, updateInterestStatus);



router.get("/all", authMiddleware, getAllInterests);




module.exports = router;