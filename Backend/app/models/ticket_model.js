const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: Number,
    required: true,
    unique: true,
  },
  flight_id: {
    type: Number,
    required: true,
  },
  trip_date: {
    type: Date,
    required: true,
  },
  passenger_seat: {
    type: Map,
    required: true,
  },
  payment_id: {
    type: Number,
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
