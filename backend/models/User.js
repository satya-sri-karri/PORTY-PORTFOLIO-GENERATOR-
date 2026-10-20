const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  otpSentAt: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },
  resetOtp: { type: String, default: null },
  resetExpiry: { type: Date, default: null },
  resetSentAt: { type: Date, default: null },
  tokenVersion: { type: Number, default: 0, select: false },
  resetAttempts: { type: Number, default: 0 },
  avatar: { type: String, default: "" },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", UserSchema);
