const express = require("express");
const app = express();
const port = process.env.port || 8000;
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bodyparser = require("body-parser");
const userRoute = require("./routes/userRoutes");
var cookieParser = require("cookie-parser");
//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieParser());

//Routes MiddleWare
app.use("/api/users", userRoute);

//Routes
app.get("/", (req, res) => res.send("Hello World!"));
//connect mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  })
  .catch((err) => console.log(err));
