const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["accepted", "rejected", "ignored", "intrested"],
      message: `Value not Accepted`,
    },
    required: true,
  },
},
{
    timestamps:true,
});

//creating an compound index to load data fast 
connectionRequest.index({fromUserId:1, toUserId:1})

//This function will give error if both fromUserId and toUserId are same
connectionRequest.pre("save", function(next){
 const sendConnectionRequest=this;
  if(sendConnectionRequest.fromUserId.equals(sendConnectionRequest.toUserId)){
    throw new Error("Can not send connection request to yourself")
  }
  next();
})


module.exports = mongoose.model("connection", connectionRequest);
