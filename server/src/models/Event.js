import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    location: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "general" },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    capacity: { type: Number, min: 1, default: null }, // null = unlimited
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

eventSchema.index({ startsAt: 1 });

export default mongoose.model("Event", eventSchema);