import React, { useState, useEffect, useContext } from "react";
import {
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Wrapper from "../../Helpers/Wrapper";

import AuthContext from "../../store/auth-context";
import BookTicket from "./BookTicket";

const Home = (props) => {
  const ctx = useContext(AuthContext);
  function formattedDate(isoDate, hours) {
    const date = new Date(isoDate);

    date.setHours(date.getHours() + hours);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hoursFormatted = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hoursFormatted}:${minutes}`;

    return formattedDate;
  }
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingFlight, setBookingFlight] = useState();
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [src, setSrc] = useState();
  const [dest, setDest] = useState();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const dateHandler = (event) => {
    setDate(event.target.value);
  };
  const timeHandler = (event) => {
    setTime(event.target.value);
  };
  const fetchStopsHandler = async () => {
    try {
      const response = await fetch("https://flight-06ee.onrender.com/get-stops", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setSource(data["source"]);
        setDestination(data["destination"]);
        setSrc(data["source"][0]);
        setDest(data["destination"][0]);
      } else if (response.status === 500) {
        throw new Error();
      } else {
        window.alert("Access Denied!!");
        ctx.onLogout();
      }
    } catch (error) {
      window.open("/", "_self");
    }
  };

  const srcChangeHandler = (event) => {
    setSrc(event.target.value);
  };
  const destChangeHandler = (event) => {
    setDest(event.target.value);
  };
  useEffect(() => {
    fetchStopsHandler();
  }, []);

  const getTodayDate = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
  };

  const fetchFlights = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://flight-06ee.onrender.com/search-flight?date=${date}&time=${time}&source=${src}&destination=${dest}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        let modifiedData = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i]["isOpen"]) modifiedData = [...modifiedData, data[i]];
        }
        setFlights(modifiedData);
      } else if (response.status === 500) {
        throw new Error();
      } else {
        window.alert("Access Denied!!");
        ctx.onLogout();
      }
    } catch (error) {
      window.alert("An Error Occured");
      window.open("/", "_self");
    }
    setIsLoading(false);
  };

  const bookTicketHandler = (flight) => {
    setIsBooking(true);
    setBookingFlight(flight);
  };

  return (
    <Wrapper>
      {!isBooking ? (
        <Wrapper>
          <Row>
            <Col className="bg-light border" sm="4" xs="6">
              <FormGroup style={{ width: "75%", margin: "2% auto" }}>
                <Label for="source">Source</Label>
                <Input
                  id="source"
                  name="source"
                  type="select"
                  disabled={source.length === 0}
                  onChange={srcChangeHandler}
                >
                  {source.map((s) => (
                    <option value={s}>{s}</option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup style={{ width: "75%", margin: "2% auto" }}>
                <Label for="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  type="select"
                  disabled={destination.length === 0}
                  onChange={destChangeHandler}
                >
                  {destination.map((d) => (
                    <option value={d}>{d}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col className="bg-light border" sm="4" xs="6">
              <FormGroup style={{ width: "75%", margin: "2% auto" }}>
                <Label for="exampleDate">Date</Label>
                <Input
                  id="exampleDate"
                  name="date"
                  min={getTodayDate()}
                  placeholder="date placeholder"
                  type="date"
                  onChange={dateHandler}
                  value={date}
                />
              </FormGroup>
              <FormGroup style={{ width: "75%", margin: "2% auto" }}>
                <Label for="exampleTime">Time (Departure Before)</Label>
                <Input
                  id="exampleTime"
                  name="time"
                  placeholder="time placeholder"
                  type="time"
                  onChange={timeHandler}
                  value={time}
                />
              </FormGroup>
            </Col>
            <Col className="bg-light border" sm="4">
              <center>
                <Button color="primary"
                  onClick={fetchFlights}
                  disabled={isLoading}
                  style={{ marginTop: "75px" }}
                >
                  {!isLoading && "Search Flight"}
                  {isLoading && "Loading..."}
                </Button>
              </center>
            </Col>
          </Row>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: "1rem",
              justifyContent: "center",
            }}
          >
            {!isLoading && flights.length === 0 && (
              <center>
                <h3>No Flights</h3>
              </center>
            )}
            {flights.map((flight) => (
              <Card
                body
                style={{ maxWidth: "25rem", margin: "0.5rem" }}
                key={flight["id"]}
              >
                <CardTitle tag="h5">
                  {flight["from"]} - {flight["to"]}
                </CardTitle>
                <CardText>
                  {formattedDate(flight["departure"], 0)} -{" "}
                  {formattedDate(flight["departure"], flight["duration"])}
                </CardText>
                <Button onClick={() => bookTicketHandler(flight)} color="primary">
                  Book Ticket {flight["booked_seats"]}/{flight["seat_count"]}
                </Button>
              </Card>
            ))}
          </div>
        </Wrapper>
      ) : (
        <BookTicket flight={bookingFlight} />
      )}
    </Wrapper>
  );
};

export default Home;
