const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");
//SendConnectionRequest API
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const fromUserId = req.userData._id;

      //Creating New schema for connection request
      const sendconnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status Code");
      }

      //validating if connection request already exist or not
      const checkConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
     
      if (checkConnectionRequest) {
        return res.status(400).send("Connection Request Already Exist!");
      }

      //Validating that user cannot send connection request to himself
      // if (fromUserId.equals(toUserId)) {
      //   return res.status(400).send("You can not send request to yourself!");
      // }

      // validating the user whome I am sending connection request
      const isUserExist = await User.findOne({ _id: toUserId });
      
      if (!isUserExist) {
        return res.status(400).send("User Not Found!");
      }
      //save the connection request to connectionRequest schema
      const data = await sendconnectionRequest.save();

      res.json({
        message: `Connection Request Send to ${isUserExist.fName}`,
        data: [data],
      });
    } catch (error) {
      res.status(404).send(error.message);
    }
  }
);
//Recieve Connection Request
requestRouter.post(
  "/request/review/:status/:fromUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.userData._id;
      const fromUserId = req.params.fromUserId;
      const status = req.params.status;
       
      const allowedStatus= ["accepted","rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).send("Wrong Status")
      }
      const isRequestExist = await connectionRequest.findOne({
        fromUserId: fromUserId,
        toUserId: loggedInUserId,
        status:"intrested"
      });
      if (!isRequestExist) {
        return res.status(400).send({ message: "No Request Exist" });
      }

      if (isRequestExist.status === "intrested") {
        isRequestExist.status="accepted";
        await isRequestExist.save();
        res.json({message:` User Request ${status}`, data:[isRequestExist]})
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
