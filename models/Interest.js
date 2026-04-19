const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  
  status:{
    type:String,
    enum:["pending","accepted","rejected"],
    default:"accepted"
  },
 
});

module.exports = mongoose.model("Interest", interestSchema);