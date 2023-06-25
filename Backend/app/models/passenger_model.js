const mongoose = require("mongoose");

var validatePhone = function (phone) {
  var regex = /^\d{10}$/;
  return regex.test(phone);
};

const passengerSchema = new mongoose.Schema({
  passenger_id: {
    type: Number,
    required: true,
    unique: true,
  },
  passenger_name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "others"],
  },
  phone: {
    type: String,
    required: true,
    validate: [validatePhone, "Please fill a valid phone number"],
  },
  booking_id: {
    type: [Number],
    default: [],
  },
});

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports =  Passenger ;
