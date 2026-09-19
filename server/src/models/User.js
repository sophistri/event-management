import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },

    // --- Email verification (uncomment to enable) ---
    // isVerified: { type: Boolean, default: false },
    // verificationToken: String,
    // verificationTokenExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
