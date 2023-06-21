const mongoose = require("mongoose");

const flightTripSchema = new mongoose.Schema({
  flight_id: {
    type: Number,
    required: true,
  },
  departure: {
    type: Date,
    required: true,
    index: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  booking_ids: {
    type: [Number],
    default: [],
  },
});

flightTripSchema.index({ flight_id: 1, departure: 1 }, { unique: true });
const FlightTrip = mongoose.model("FlightTrip", flightTripSchema);

module.exports = FlightTrip;
