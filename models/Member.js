import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide member name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number"],
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    gender: {
      type: String,
      required: [true, "Please provide gender"],
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
      required: [true, "Please provide age"],
      min: [12, "Age must be at least 12"],
      max: [100, "Age must be less than 100"],
    },
    height: {
      type: Number,
      required: [true, "Please provide height in cm"],
      min: [100, "Height must be at least 100cm"],
    },
    weight: {
      type: Number,
      required: [true, "Please provide weight in kg"],
      min: [30, "Weight must be at least 30kg"],
    },
    membershipStatus: {
      type: String,
      enum: ["Active", "Expired", "Pending"],
      default: "Pending",
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    currentSubscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
