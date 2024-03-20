const asyncHandler = require("express-async-handler"); // for error handling in async route handling with try catch
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//user token generation
const generateTocken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register user
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

//Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //validate
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password.");
  }

  //Check if user exists
  const user = await User.findOne({ emailil });

  if (!user) {
    res.status(400);
    throw new Error("User not found. Please signup");
  }

  //User exists, check if password is correct
  const pwCorrect = await bcrypt.compare(password, user.password);

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

  if (user && pwCorrect) {
    const { id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: none,
    secure: true,
  });
  return res.status(200).json({ message: "Successfully logged out." });
});

//Get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found.");
  }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.tocken;
  if (!token) {
    return res.json(false);
  }
  //verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

//Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, please sign up");
  }
  //Validata
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  //Check if password matches db password
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("password changed successfully.");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect.");
  }
});

module.exports = {
  phonebioterUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
};
