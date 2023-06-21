const mongoose = require("mongoose");

const flightInfoSchema = new mongoose.Schema({
  flight_id: {
    type: Number,
    required: true,
    unique: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  seat_count: {
    type: Number,
    default: 60,
  },
  price: {
    type: Number,
    required: true,
  }
});

const FlightInfo = mongoose.model("FlightInfo", flightInfoSchema);

module.exports =  FlightInfo ;
