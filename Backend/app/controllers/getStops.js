const FlightInfo = require("../models/flight_info_model");

const getStops = async (req, res) => {
  try {
    if (req.user.role === "user" || req.user.role === "admin") {
      const uniqueFrom = await FlightInfo.distinct("from");
      const uniqueTo = await FlightInfo.distinct("to");
      res.status(200).json({ source: uniqueFrom, destination: uniqueTo });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};
module.exports = getStops;
