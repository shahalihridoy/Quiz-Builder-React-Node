const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 128,
      validate: [validator.isEmail, "Invalid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
      select: false,
    },
    __v: { type: Number, select: false },
  },
  {
    timestamps: true,
  }
);

// encrypt password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.methods.checkPassword = (candidatePassword, userPassword) =>
  bcrypt.compare(candidatePassword, userPassword);

module.exports = mongoose.model("User", userSchema);
