const Passenger = require("../models/passenger_model");

const addPassenger = async (req, res) => {
  try {
    if (req.user.role === "user") {
      const { passenger_name, gender, phone } = req.body;

      const passenger = await Passenger.findOne(
        {},
        {},
        { sort: { passenger_id: -1 } }
      );

      let passenger_id;
      if (!passenger) passenger_id = 1;
      else passenger_id = passenger.passenger_id + 1;

      const newPassenger = new Passenger({
        passenger_id: passenger_id,
        passenger_name: passenger_name,
        gender: gender,
        phone: phone,
      });
      await newPassenger.save();

      res
        .status(200)
        .json({ message: "Passenger added", passenger_id: passenger_id });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = addPassenger;
