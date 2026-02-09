import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Expired"],
      default: "Active",
    },
    amountPaid: {
      type: Number,
      required: true,
      min: [0, "Amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
subscriptionSchema.index({ member: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// Method to check if subscription is expired
subscriptionSchema.methods.isExpired = function () {
  return new Date() > this.endDate;
};

// Pre-save hook to update status based on end date
subscriptionSchema.pre("save", function (next) {
  if (this.isExpired()) {
    this.status = "Expired";
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
