const Passenger = require("../models/passenger_model");
const Ticket = require("../models/ticket_model");

const userViewBooking = async (req, res) => {
  try {
    const passenger_id = req.body.passenger_id;
    const passenger = await Passenger.findOne({ passenger_id: passenger_id });

    if (!passenger) {
      return res.status(404).json({ message: "Invalid passenger" });
    }

    const tickets = await Ticket.find({
      ticket_id: { $in: passenger.booking_id },
    });

    res.status(200).json({ message: tickets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = userViewBooking;
