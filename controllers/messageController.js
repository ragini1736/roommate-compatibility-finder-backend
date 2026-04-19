
const { getIO } = require("../socket/socket"); // Path dhyan se check kar lena
const Message = require("../models/Message");

// 🔥 1. SEND MESSAGE (Bina refresh ke dikhane wala logic)
const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    // Database mein save karne ke liye object banaya
    const msg = new Message({
      sender: req.userId,
      receiver,
      text
    });

    const savedMsg = await msg.save();

    // REAL-TIME LOGIC: Hawa mein message phenkna (Emit)
    try {
      const io = getIO(); 
      io.emit("receiveMessage", savedMsg); 
      console.log("Socket: Message emitted successfully!");
    } catch (socketErr) {
      console.log("Socket Error: getIO fail ho gaya, check App.js", socketErr.message);
    }

    res.json(savedMsg);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🔥 2. GET MESSAGES (Purane messages load karne ke liye)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  sendMessage,
  getMessages
};