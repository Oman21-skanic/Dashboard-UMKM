const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., 'tiktok', 'instagram'
  tiktokShopId: { type: String },
  accessToken: { type: String }, // Encrypted
  refreshToken: { type: String }, // Encrypted
  expiresAt: { type: Date }
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String },
  channels: [ChannelSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);