const express = require("express");
// const multer = require("multer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require('cors')
const PORT=2000


const userRouter = require('./router/user.routes');
const todoRouter=require('./router/todo.routes');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
  
});


app.use(cors());
app.use("/", userRouter);
app.use("/",todoRouter)
app.listen(PORT, () => {
  console.log(`Server is running on port:- ${PORT}`);
});
