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
const PORT = process.env.PORT || 4000;
// Middleware
app.use(express.json()); // Parse JSON body
app.use(cookieParser()); // Parse cookies

// app.use(cors(
//   {
//     origin:"http://localhost:5173",
//     credentials:true
//   }
// ));

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.25:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use("/",authRouter);
app.use("/", profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

//DB Connection code
connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(PORT,'0.0.0.0', () => {
      console.log("Your server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
