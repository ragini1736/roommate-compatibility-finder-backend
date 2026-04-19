const Interest = require("../models/Interest");
const Profile = require("../models/Profile");


// SAVE INTEREST
const sendInterest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.userId; // from token (later)

    const already = await Interest.findOne({
      fromUser: fromUserId,
      toUser: toUserId
    });

    if (already) {
      return res.json({ message: "Already interested" });
    }

    const newInterest = new Interest({
      fromUser: fromUserId,
      toUser: toUserId
    });

    await newInterest.save();

    res.json({ message: "Interest Sent ❤️" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMyInterests = async (req, res) => {
  try {
    console.log("USER ID:",req.userId);
    const interests = await Interest.find({
        fromUser:req.userId
    })
    .populate("toUser");
    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//incoming
const getIncomingInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      toUser: req.userId
    }).populate({
         path:"fromUser",
         select:"name email",
         populate:{
          path:"profile",
          select:"city budget"
         }
        });

    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//updateinterst
const updateInterestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const interest = await Interest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json({ message: `Interest ${status}` });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllInterests = async (req, res) => {
  try {

    const sent = await Interest.find({
      fromUser: req.userId,
      status: "accepted"
    })
    .populate({
      path: "toUser",
      populate: {
        path: "profile",
        select: "city budget"
      }
    });

    const incoming = await Interest.find({
      toUser: req.userId,
      status: "accepted"
    })
    .populate({
      path: "fromUser",
      populate: {
        path: "profile",
        select: "city budget"
      }
    });

    res.json({
      sent: sent.map(i => i.toUser).filter(u => u),
      incoming: incoming.map(i => i.fromUser).filter(u => u)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = { 
    sendInterest,
    getMyInterests,
    getIncomingInterests,
    updateInterestStatus,
    getAllInterests

 };