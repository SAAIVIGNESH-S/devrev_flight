const FlightInfo = require("../models/flight_info_model");
const FlightTrip = require("../models/flight_trip_model");
const searchFlight = async (req, res) => {
  try {
    if (req.user.role === "user" || req.user.role === "admin") {
      let result = [];
      let { source, destination, date, time } = req.query;
      console.log(time);
      const flightIds = await FlightInfo.find(
        {
          from: source,
          to: destination,
        },
        { flight_id: 1, _id: 0 }
      );
      console.log(date + "T" + time + ":00Z");
      let inputDate = date + "T" + time + ":00Z";
      const ids = flightIds.map((flight) => flight.flight_id);

      /*const flights = await FlightTrip.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [
                    {
                      $dateToString: { format: "%Y-%m-%d", date: "$departure" },
                    },
                    date,
                  ],
                },
                { $lt: [{ $substr: ["$departure", 11, 5] }, time] },
              ],
            },
            flight_id: { $in: ids },
          },
        },
      ]);*/
      const flights = await FlightTrip.find({
        departure: {
          $lt: new Date(inputDate).toISOString(),
          $gte: new Date(date).toISOString(),
        },
        flight_id:{$in:ids}
      });
      console.log(flights);

      for (let i = 0; i < flights.length; i++) {
        let individualFlightId = flights[i].flight_id;
        let departure = flights[i].departure;
        let isOpen = flights[i].isOpen;
        let flightDetail = await FlightInfo.findOne({
          flight_id: individualFlightId,
        });
        let temp = {
          _id: flights[i]._id,
          flight_id: individualFlightId,
          departure: departure,
          isOpen: isOpen,
          from: flightDetail.from,
          to: flightDetail.to,
          duration: flightDetail.duration,
          seat_count: flightDetail.seat_count,
          price: flightDetail.price,
          booked_seats: flights[i].booking_ids.length,
        };
        result.push(temp);
      }
      res.status(200).json(result);
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = searchFlight;
