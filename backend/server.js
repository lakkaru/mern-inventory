const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Routes middleware
app.use("/api/users", userRoutes);

// Routes
app.get("/", (req, res) => {
    // console.log('home');
    res.send("Home Page");
   
    
  });

// Error middleware
app.use(errorHandler);

// Connect to DB and start server
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
