const FlightInfo = require("../models/flight_info_model");
const FlightTrip = require("../models/flight_trip_model");

const removeFlight = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const { flight_id, given_date } = req.body;
      const flight = await FlightInfo.findOne({ flight_id: flight_id });

      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }
      let date = new Date(given_date);
      const filter = {
        flight_id: flight_id,
        departure: { $gt: date },
      };

      const update = { isOpen: false };

      const result = await FlightTrip.updateMany(filter, update);
      
      res.status(200).json({
        message: `${result.modifiedCount} Flight trips cancelled`,
      });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = removeFlight;
