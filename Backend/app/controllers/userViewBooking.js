const Passenger = require("../models/passenger_model");
const Ticket = require("../models/ticket_model");

const userViewBooking = async (req, res) => {
  try {
    if (req.user.role === "user") {
      const tickets = await Ticket.find({
        user_email: { $eq: req.user.email },
      });

      let temp = [];

      for (let i = 0; i < tickets.length; i++) {
        let ticket = tickets[i];
        ticket["passenger_seat"].forEach((key, value) => {
          temp.push({
            ticket_id: ticket["ticket_id"],
            flight_id: ticket["flight_id"],
            trip_date: ticket["trip_date"],
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

module.exports = userViewBooking;
