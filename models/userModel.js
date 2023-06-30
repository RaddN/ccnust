const mongoose = require("mongoose");
const { Schema } = mongoose;
var bcrypt = require("bcryptjs");
const { use } = require("../routes/userRoutes");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "please add a email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
      minLength: [6, "Password should be minimum 6 character"],
      // maxLength: [23, "Password max length exists"],
    },
    photo: {
      type: String,
      default: "https://i.ibb.co/jGhyKyJ/Basic-Ui-186.jpg",
    },
    phone: {
      type: String,
      required: [true, "Enter a phone"],
      default: "+880",
      unique: true,
    },
    bio: {
      type: String,
      maxLength: [23, "Bio max length exists"],
    },
    longitude: String,
    latitude: String,
    lastupdatetime:String
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //encrypt password before submit in database
  var salt = await bcrypt.genSalt(10);
  var encryptedPassword = await bcrypt.hash(this.password, salt);
  this.password = encryptedPassword;
  next();
});
const User = mongoose.model("drives", userSchema);
module.exports = User;
