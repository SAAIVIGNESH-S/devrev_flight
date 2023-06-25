const FlightInfo = require("../models/flight_info_model");
const FlightTrip = require("../models/flight_trip_model");

const addFlight = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { from, to, duration, seat_count, price, days, departure } =
        req.body;
      const [hour, min] = departure.split(":");

      const flight = await FlightInfo.findOne(
        {},
        {},
        { sort: { flight_id: -1 } }
      );

      let flight_id;
      if (!flight) flight_id = 1;
      else flight_id = flight.flight_id + 1;

      const newFlight = new FlightInfo({
        flight_id: flight_id,
        from: from,
        to: to,
        duration: duration,
        seat_count: seat_count,
        price: price,
      });
      await newFlight.save();

      const trips = [];
      const currentDate = new Date();
      for (let i = 0; i < days; i++) {
        const date = new Date(
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            hour,
            min
          )
        );
        date.setDate(date.getDate() + i);
        const tripsData = {
          flight_id: flight_id,
          departure: date,
        };

        trips.push(tripsData);
      }
      await FlightTrip.insertMany(trips);

      res.status(200).json({ message: "Flight added", flight_id: flight_id });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = addFlight;
