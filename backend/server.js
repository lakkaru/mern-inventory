const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const multer = require("multer");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Multer middleware for handling form data
const storage = multer.memoryStorage(); // You can customize storage as needed
const upload = multer({ storage: storage });

// Routes middleware
app.use("/api/users", userRoutes);

// Example route for handling form data
app.post("/upload", upload.single("file"), (req, res) => {
  // Access form data using req.body
  const name = req.body.name;
  const age = req.body.age;

  // Access uploaded file using req.file
  const file = req.file;

  // Your logic here with the form data and file

  res.send("Form data received successfully");
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
