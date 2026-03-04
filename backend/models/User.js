const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String },
  channels: [String] 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);2