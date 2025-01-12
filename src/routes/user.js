const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const finalUserData=["fName", "lName", "gender", "age", "skills"];
//ALL Matched Users API
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const currentUserid = req.userData._id;
    const allUserConnections = await connectionRequest
      .find({
        $or: [{toUserId: currentUserid,status: "accepted"}, {fromUserId: currentUserid,status: "accepted"}],
        
      })
      .populate("fromUserId", finalUserData).populate("toUserId", finalUserData);

      const matchedUsersData= allUserConnections.map((data)=>{
        if(data.fromUserId._id.toString()=== currentUserid.toString()){
            return data.toUserId;
        }
        else{
            return data.fromUserId;
        }
      })
    res.json({ message: "All Connections!", data: matchedUsersData });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


// All Intrested User API
userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const currentUserid = req.userData._id;
    const allIntrestedUsers = await connectionRequest
      .find({ toUserId: currentUserid, status: "intrested" })
      .populate("fromUserId", finalUserData);
    res.json({ message: "Intrested Users Found", data: [allIntrestedUsers] });
  } catch (error) {
    res.status(400).send("No requests found!");
  }
});

//User Feed API
userRouter.get("/user/feed",userAuth, async(req,res)=>{
    try {
        const currentUserid=req.userData._id;
        const page=parseInt(req.query.page) || 0;
        let limit=parseInt(req.query.limit) || 5;
         limit=limit>100? 100: limit;
        const skip=(page-1)*limit;
        const UserStatusData = await connectionRequest
      .find({
        $or: [{toUserId:currentUserid}, {fromUserId:currentUserid}],
        
      }).select("fromUserId toUserId")
      console.log(UserStatusData)
       const hiddenUserId=new Set();
         UserStatusData.forEach((req)=>{
            hiddenUserId.add(req.toUserId.toString())
            hiddenUserId.add(req.fromUserId.toString())
        })
        const allUsers=await User.find({
           $and:[ {_id: {$nin : Array.from(hiddenUserId)}},{_id: {$ne : currentUserid}}]
        }).skip(skip).limit(limit);
       
        res.send({ data:allUsers})
        
    } catch (error) {
        res.status(400).send("Error", error?.message)
    }
})

module.exports = userRouter;
