const FlightTrip = require("../models/flight_trip_model");
const Ticket = require("../models/ticket_model");

const adminViewBooking = async (req, res) => {
  try {
    const { flight_id, departure } = req.body;
    const flight = await FlightTrip.findOne({
      flight_id: flight_id,
      departure: departure,
    });

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const tickets = await Ticket.find({
      ticket_id: { $in: flight.booking_ids },
    });

    res.status(200).json({ message: tickets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = adminViewBooking;
