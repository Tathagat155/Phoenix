const mongoose = require("mongoose");
const flightSchema = new mongoose.Schema(
  {
    airline: { type: String, required: true, trim: true },
    flightNumber: { type: String, required: true, trim: true, unique: true },
    sourceCity: { type: String, required: true, trim: true },
    destinationCity: { type: String, required: true, trim: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, default: "2h 30m" },
    price: { type: Number, required: true },
    totalSeats: { type: Number, default: 180 },
  },
  { timestamps: true },
); 


// Index for faster route-based search flightSchema.index({ sourceCity: 1, destinationCity: 1 });
 module.exports = mongoose.model('Flight', flightSchema);
