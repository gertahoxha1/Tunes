const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"], 
    minlength: [3, "Name must be at least 3 characters long"], 
    maxlength: [30, "Name must be at most 30 characters long"] 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"] 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"], 
    minlength: [5, "Password must be at least 5 characters long"], 
    maxlength: [50, "Password must be at most 50 characters long"] 
  },
});

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
