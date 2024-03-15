const asyncHandler = require("express-async-handler"); // for error handling in async route handling with try catch
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//user token generation
const generateTocken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("Request Body:", JSON.stringify(req.body));

  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please " + name + " fill in all required fields.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be upto six characters.");
  }

  //check if user email alredy exists
  const userExists = await User.findOne({});
  if (userExists) {
    res.status(400);
    throw new Error("Email has been alredy registered");
  }

  //create the user
  const user = await User.create({
    name,
    email,
    password,
  });

  //generate tocken
  const token = generateTocken(user._id);

  //Send HTTP-only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), //one day
    sameSite: none,
    secure: true,
  });

  if (user) {
    const { id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      tocken,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = {
  registerUser,
};
