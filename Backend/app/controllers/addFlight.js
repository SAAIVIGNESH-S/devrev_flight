const FlightInfo = require("../models/flight_info_model");
const FlightTrip = require("../models/flight_trip_model");

const addFlight = async (req, res) => {
  try {
    const { from, to, duration, seat_count, price, days } = req.body;

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
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const tripsData = {
        flight_id: flight_id,
        departure: date,
      };

      trips.push(tripsData);
    }
    await FlightTrip.insertMany(trips);

    res.status(200).json({ message: "Flight added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = addFlight;
