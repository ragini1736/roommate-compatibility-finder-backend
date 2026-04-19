const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type:String,
    required:true,
    unique:true
  },
  password: {
    type:String,
    select:false
},
profile:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Profile"
  }});

module.exports = mongoose.model("User", userSchema);