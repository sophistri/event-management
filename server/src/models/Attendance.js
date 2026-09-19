import mongoose from "mongoose";

// One document per (event, user) registration.
const attendanceSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true } // createdAt = when they registered
);

// A user can register for a given event only once. This index is what enforces it.
attendanceSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);