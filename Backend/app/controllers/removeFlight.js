const FlightInfo = require("../models/flight_info_model");

const removeFlight = async (req, res) => {
  try {
    const flight_id = req.body.flight_id;
    const flight = await FlightInfo.findOne({flight_id: flight_id});

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    await flight.remove();

    res.status(200).json({ message: "Flight deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = removeFlight;
