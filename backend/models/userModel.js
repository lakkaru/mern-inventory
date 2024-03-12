const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name."] },
    email: {
      type: String,
      required: [true, "Please add a name."],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password."],
      minLength: [6, "Pasword must have six characters."],
      // maxLength:[23, "Pasword must shoter than 23 characters."]
    },
    photo: {
      type: String,
      required: [true, "Please add a photo."],
      default:
        "data:image/jpeg;base64,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",
    },
    phone: {
      type: String,

      default: "+123",
    },
    bio: {
      type: String,
      default: "bio",
      maxLength: [250, "Bio must shoter than 250 characters."],
    },
  },
  {
    timestamps: true,
  }
);

//Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  //hash passsword
  const salt = await bcrypt.genSalt(10);
  const hashedPasssword = await bcrypt.hash(this.password, salt);
  this.password = hashedPasssword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
