const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: "Flight" },
    flightAirline: { type: String, required: true },
    flightNumber: { type: String, required: true },
    sourceCity: { type: String, required: true },
    destinationCity: { type: String, required: true },
    journeyDate: { type: String, required: true },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Booking", bookingSchema);
