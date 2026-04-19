const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  age: String,
  city: String,
  budget: String,
  food: String,
  smoking: String,
  sleep: String,
  cleanliness: String,

  userId:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("Profile", profileSchema);