const FlightInfo = require("../models/flight_info_model");
const FlightTrip = require("../models/flight_trip_model");

const searchFlight = async (req, res) => {
  try {
    let result = [];
    let { date, time } = req.body;
    date = new Date(date);
    time = new Date(time);
    const query = {
      departure: {
        $gte: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes()
        ),
      },
    };
    const flights = await FlightTrip.find(query);

    for (let i = 0; i < flights.length; i++) {
      let individualFlightId = flights[i].flight_id;
      let departure = flights[i].departure;
      let isOpen = flights[i].isOpen;
      let flightDetail = await FlightInfo.findOne({
        flight_id: individualFlightId,
      });
      let temp = {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occured" });
  }
};

module.exports = searchFlight;
