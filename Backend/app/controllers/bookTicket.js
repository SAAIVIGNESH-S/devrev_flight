const FlightTrip = require("../models/flight_trip_model");
const Passenger = require("../models/passenger_model");
const Ticket = require("../models/ticket_model");

const bookTicket = async (req, res) => {
  try {
    if (req.user.role === "user") {
      const { flight_id, trip_date, passenger_id, email } = req.body;

      const ticket = await Ticket.findOne({}, {}, { sort: { ticket_id: -1 } });

      let ticket_id;
      if (!ticket) ticket_id = 1;
      else ticket_id = ticket.ticket_id + 1;

      let payment_id;
      if (!ticket) payment_id = 1;
      else payment_id = ticket.payment_id + 1;

      const flight = await FlightTrip.findOne({
        flight_id: flight_id,
        departure: trip_date,
      });
      let seat = 0;
      seat = flight.booking_ids.length;

      if (seat + passenger_id.length > 60) {
        flight.isOpen = false;
        await flight.save();
        return res.status(200).json({ message: "Tickets unavailable" });
      }

      let passenger_seat = new Map();
      for (let i = 0; i < passenger_id.length; i++) {
        const passenger = await Passenger.find({
          passenger_id: passenger_id[i],
        });
        console.log(passenger);
        if (passenger.length <= 0)
          return res.status(200).json({ message: "Invalid Passenger Details" });
        passenger_seat.set(passenger_id[i].toString(), seat + i + 1);
      }
      const newTicket = new Ticket({
        ticket_id: ticket_id,
        user_email: req.user.email,
        flight_id: flight_id,
        trip_date: trip_date,
        passenger_seat: passenger_seat,
        payment_id: payment_id,
      });
      await newTicket.save();
      if (seat + passenger_id.length == 60) {
        flight.isOpen = false;
      }

      flight.booking_ids.push(ticket_id);
      await flight.save();

      for (let i = 0; i < passenger_id.length; i++) {
        await Passenger.updateOne(
          { passenger_id: passenger_id },
          {
            $push: {
              booking_id: ticket_id,
            },
          }
        );
      }

      res.status(200).json({ message: "Tickets Booked" });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = bookTicket;
