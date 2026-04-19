require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const connectDB=require("./db");
const{setupSocket} =require("./socket/socket");
const http = require("http");
//const { Server } = require("socket.io");





const myprofileRoutes = require("./routes/myprofile");
const interestRoutes = require("./routes/interest");
const messageRoutes=require("./routes/message");
const matchRoutes = require("./routes/matchRoutes");



const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Profile = require("./models/Profile");

const authMiddleware = require("./middleware/auth");

 //connected const 
 connectDB();

const app = express();

app.use(cors({
  origin: "https://roommate-compatibility-finder-front.vercel.app", 
  credentials: true
}));
app.use(express.json());

// routes
app.use("/profile", myprofileRoutes);
app.use("/interest", interestRoutes);
app.use("/message",messageRoutes);
app.use("/matches", matchRoutes);

// test
app.get("/", (req, res) => {
  res.send("Backend running");
});

// DB
// /mongoose.connect("mongodb://127.0.0.1:27017/roommate")
  //.then(() => console.log("DB connected"))
 // .catch(() => console.log("DB error"));


  app.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // 🔹 Clean input
    email = email.trim().toLowerCase();
    name = name.trim();

    // 🔹 Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Strong password check
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*!]{6,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters and include letters & numbers"
      });
    }

    // 🔹 Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Save user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // 🔹 Create token (auto login after signup)
    const token = jwt.sign({ id: user._id }, "secretkey", {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Signup successful 🎉",
      token
    });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
  




//  LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const cleanEmail = email.trim().toLowerCase();
    // 🔥 FIXED LINE
    const user = await User.findOne({ email: cleanEmail }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.password) {
      return res.status(500).json({ message: "Password missing in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({ message: "Login successful", token });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



//  GET ALL PROFILES
app.get("/profiles", async (req, res) => {
  const profiles = await Profile.find();
  res.json(profiles);
});


// MATCH
app.get("/match/:id", async (req, res) => {
  try {
    const user = await Profile.findById(req.params.id);
    if (!user) return res.json([]);

    const allUsers = await Profile.find();

    let results = allUsers.map(other => {
      let score = 0;

      if (user.city === other.city) score += 20;
      if (user.budget === other.budget) score += 20;
      if (user.food === other.food) score += 20;
      if (user.smoking === other.smoking) score += 20;
      if (user.sleep === other.sleep) score += 20;

      return {
        profile: other,
        match: score,
        toUserId:user.userId
      };
    });

    res.json(results);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  PROFILE CREATE (NOW USING MIDDLEWARE)
app.post("/profile", authMiddleware, async (req, res) => {
  try {
    const profile = new Profile({
      ...req.body,
      userId: req.userId   // 🔥 FROM MIDDLEWARE
    });

    const savedProfile = await profile.save();

    await User.findByIdAndUpdate(req.userId,{
      profile:savedProfile.id});
    

    res.json({
      message: "Profile saved",
      profileId: savedProfile._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//server

const server = http.createServer(app);

// Socket initialize karo
setupSocket(server); 



const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(" Server running on " + PORT);
});