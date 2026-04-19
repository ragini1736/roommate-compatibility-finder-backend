const Interest = require("../models/Interest");
const User = require("../models/User");

// 🔥 GET MATCHED USERS
const getMatches = async (req, res) => {
    console.log("Working");
  try {
    const userId = req.userId;

    const matches = await Interest.find({
      $or: [
        { fromUser: userId, status: "accepted" },
        { toUser: userId, status: "accepted" }
      ]
    });

    const userIds = matches.map(m =>
  m.fromUser.toString() === userId
    ? m.toUser.toString()
    : m.fromUser.toString()
);
   
    const users = await User.find({
      _id: { $in: userIds }
    });

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { 
    getMatches
 };