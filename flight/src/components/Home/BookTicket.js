import { useState, useContext } from "react";
import Wrapper from "../../Helpers/Wrapper";
import {
  Row,
  Col,
  Input,
  FormGroup,
  Label,
  Card,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import AddPassenger from "./AddPassenger";
import ExistingPassenger from "./ExistingPassenger";
import AuthContext from "../../store/auth-context";

const BookTicket = (props) => {
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
  const [existingPassenger, setExistingPassenger] = useState(0);
  const [newPassenger, setNewPassenger] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [existingPassengerComponents, setexistingPassengerComponents] =
    useState([]);
  const [newPassengerComponents, setnewPassengerComponents] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [passengerId, setPassengerId] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  const existingPassengerChangeHandler = (event) => {
    setExistingPassenger(event.target.value);
    if (event.target.value >= 0 && newPassenger >= 0) setIsDisabled(false);
    else setIsDisabled(true);
  };

  const newPassengerChangeHandler = (event) => {
    setNewPassenger(event.target.value);
    if (existingPassenger >= 0 && event.target.value >= 0) setIsDisabled(false);
    else setIsDisabled(true);
  };

  const addIdHandler = (id) => {
    setPassengerId((prev) => [...prev, +id]);
  };

  const existingPassengerForm = [];
  const newPassengerForm = [];
  const countSubmitHandler = () => {
    for (let i = 0; i < existingPassenger; i++) {
      existingPassengerForm.push(<ExistingPassenger addId={addIdHandler} />);
    }

    for (let i = 0; i < newPassenger; i++)
      newPassengerForm.push(<AddPassenger addId={addIdHandler} />);
    setexistingPassengerComponents(existingPassengerForm);
    setnewPassengerComponents(newPassengerForm);
    setIsSuccess(true);
  };

  const bookTicketHandler = async () => {
    console.log(passengerId);
    setIsBooking(true);
    try {
      const body = {
        flight_id: props.flight.flight_id,
        trip_date: props.flight.departure,
        passenger_id: passengerId,
      };

      const response = await fetch("https://flight-06ee.onrender.com/book-ticket", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        window.alert(data["message"]);
        window.open("/", "_self");
        props.setIsBooking(false);
      } else if (response.status === 500) {
        throw new Error();
      } else {
        window.alert("Access Denied!!");
        ctx.onLogout();
      }
    } catch (error) {
      setError("An error occured");
    }
    setIsBooking(false);
  };
  return (
    <Wrapper>
      <center>
        <Card body style={{ maxWidth: "25rem", margin: "0.5rem" }}>
          <CardTitle tag="h5">
            {props.flight["from"]} - {props.flight["to"]}
          </CardTitle>
          <CardText>
            {formattedDate(props.flight["departure"], 0)} -{" "}
            {formattedDate(props.flight["departure"], props.flight["duration"])}
          </CardText>
          <CardText>Rs.{props.flight["price"]}</CardText>
        </Card>
      </center>
      <Row>
        <Col className="bg-light" sm="4" xs="6">
          <FormGroup style={{ width: "75%", margin: "2% auto" }}>
            <Label for="exampleDate">Existing Passenger</Label>
            <Input
              disabled={isSuccess}
              placeholder="Existing Passenger"
              type="number"
              onChange={existingPassengerChangeHandler}
              value={existingPassenger}
            />
          </FormGroup>
        </Col>
        <Col className="bg-light" sm="4" xs="6">
          <FormGroup style={{ width: "75%", margin: "2% auto" }}>
            <Label for="exampleTime">New Passenger</Label>
            <Input
              disabled={isSuccess}
              placeholder="New Passenger"
              type="number"
              onChange={newPassengerChangeHandler}
              value={newPassenger}
            />
          </FormGroup>
        </Col>
        <Col className="bg-light" sm="4">
          <center>
            <br />
            <Button color="primary"
              onClick={countSubmitHandler}
              disabled={isDisabled || isSuccess}
            >
              {isSuccess
                ? `Rs. ${
                    props.flight["price"] * (+existingPassenger + +newPassenger)
                  }`
                : "Add Count"}
            </Button>
          </center>
        </Col>
      </Row>
      {existingPassengerComponents.length !== 0 && (
        <center>
          <br />
          <h4>Enter Existing Passenger id</h4>
        </center>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "1rem",
          justifyContent: "center",
        }}
      >
        {existingPassengerComponents}
      </div>
      {newPassengerComponents.length !== 0 && (
        <center>
          <br /> <br />
          <h4>Enter New Passenger details</h4>
        </center>
      )}
      {newPassengerComponents}
      {+newPassenger + +existingPassenger === passengerId.length &&
        passengerId.length !== 0 && (
          <center>
            <Button onClick={bookTicketHandler} disabled={isBooking} color="primary" style={{marginTop:"20px"}}>
              {!isBooking && "Book Ticket"} {isBooking && "Booking..."}
            </Button>
          </center>
        )}
      <center>
        <p style={{ color: "red" }}>{error}</p>
      </center>
    </Wrapper>
  );
};

export default BookTicket;
