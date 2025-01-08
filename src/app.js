const express = require("express");
const cors=require("cors")
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter=require("./routes/user");
const app = express();
require("dotenv").config();
// Middleware
app.use(express.json()); // Parse JSON body
app.use(cookieParser()); // Parse cookies
app.use(cors(
  {
    origin:"http://localhost:5173",
    credentials:true
  }
));

app.use("/",authRouter);
app.use("/", profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

//DB Connection code
connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(4000, () => {
      console.log("Your server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
