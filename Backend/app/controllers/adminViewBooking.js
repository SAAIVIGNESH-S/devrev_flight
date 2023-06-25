const FlightTrip = require("../models/flight_trip_model");
const Ticket = require("../models/ticket_model");

const adminViewBooking = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { flight_id, departure } = req.query;

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

      let temp = [];

      for (let i = 0; i < tickets.length; i++) {
        let ticket = tickets[i];
        ticket["passenger_seat"].forEach((key, value) => {
          temp.push({
            ticket_id: ticket["ticket_id"],
            user_email: ticket["user_email"],
            passenger_seat: key,
            passenger_id: value,
            payment_id: ticket["payment_id"],
          });
        });
      }

      res.status(200).json({ message: temp });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = adminViewBooking;
