const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes middleware
app.use("/api/users", userRoutes);

//Routes
app.get("/", (req, res) => {
  res.send("Home Page");
});

//Error middleware
app.use(errorHandler);

// conet to DB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on PORT ${PORT} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
