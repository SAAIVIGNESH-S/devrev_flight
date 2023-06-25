import React, { useState, useContext } from "react";

import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";

import AuthContext from "../../store/auth-context";

const AddFlight = (props) => {
  const ctx = useContext(AuthContext);
  const [from, setFrom] = useState("");
  const [isFromInvalid, setIsFromInvalid] = useState(false);
  const [to, setTo] = useState("");
  const [isToInvalid, setIsToInvalid] = useState(false);
  const [toError, setToError] = useState("");
  const [duration, setDuration] = useState("");
  const [isDurationInvalid, setIsDurationInvalid] = useState(false);
  const [price, setPrice] = useState("");
  const [isPriceInvalid, setIsPriceInvalid] = useState(false);
  const [days, setDays] = useState("");
  const [isDaysInvalid, setIsDaysInvalid] = useState(false);
  const [time, setTime] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fromChangeHandler = (event) => {
    setFrom(event.target.value.trim());
    setIsFromInvalid(event.target.value.trim() === "");
  };
  const toChangeHandler = (event) => {
    setTo(event.target.value.trim());
    setIsToInvalid(
      event.target.value.trim() === "" || from === event.target.value.trim()
    );
    if (from === event.target.value.trim() && from !== "")
      setToError("Source and Destination can't be same");
    else setToError("Enter valid destination");
  };
  const durationChangeHandler = (event) => {
    setDuration(event.target.value);
    setIsDurationInvalid(event.target.value <= 0);
  };
  const priceChangeHandler = (event) => {
    setPrice(event.target.value);
    setIsPriceInvalid(event.target.value <= 0);
  };
  const daysChangeHandler = (event) => {
    setDays(event.target.value);
    setIsDaysInvalid(event.target.value <= 0);
  };
  const timeChangeHandler = (event) => {
    setTime(event.target.value);
  };
  const addFlightHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const flight = {
        from: from,
        to: to,
        duration: duration,
        price: price,
        days: days,
        departure: time,
      };

      const response = await fetch("http://localhost:8080/add-flight", {
        method: "POST",
        body: JSON.stringify(flight),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        if (data["message"] === "Flight added") {
          window.alert(`Flight added (id: ${data["flight_id"]})`);
          window.open("/", "_self");
        }
      } else if (response.status === 500) {
        throw new Error();
      } else {
        window.alert("Access Denied!!");
        ctx.onLogout();
      }
    } catch (error) {
      setError("An error occured");
    }
    setIsLoading(false);
  };
  return (
    <Card
      className="my-2"
      style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
    >
      <CardBody>
        <FormGroup>
          <Label for="from">From</Label>
          <Input
            disabled={isLoading}
            value={from}
            invalid={isFromInvalid}
            type="text"
            onChange={fromChangeHandler}
          />
          <FormFeedback>Enter valid source</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="to">To</Label>
          <Input
            disabled={isLoading}
            value={to}
            invalid={isToInvalid}
            type="text"
            onChange={toChangeHandler}
          />
          <FormFeedback>{toError}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="duration">Duration</Label>
          <Input
            disabled={isLoading}
            min={1}
            value={duration}
            invalid={isDurationInvalid}
            type="number"
            onChange={durationChangeHandler}
          />
          <FormFeedback>Enter valid duration</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="price">Price</Label>
          <Input
            disabled={isLoading}
            min={1}
            value={price}
            invalid={isPriceInvalid}
            type="number"
            onChange={priceChangeHandler}
          />
          <FormFeedback>Enter valid price</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="days">Number of Trips</Label>
          <Input
            disabled={isLoading}
            min={1}
            value={days}
            invalid={isDaysInvalid}
            type="number"
            onChange={daysChangeHandler}
          />
          <FormFeedback>Enter valid number of trips</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="time">Departure Time</Label>
          <Input
            disabled={isLoading}
            value={time}
            type="time"
            onChange={timeChangeHandler}
          />
        </FormGroup>
      </CardBody>
      <Button color="primary"
        onClick={addFlightHandler}
        disabled={
          isFromInvalid ||
          isToInvalid ||
          isDurationInvalid ||
          isPriceInvalid ||
          isDaysInvalid ||
          time === undefined
        }
      >
        {isLoading ? "Adding Flight..." : "Add Flight"}
      </Button>
      <center>
        <p style={{ color: "red" }}>{error}</p>
      </center>
    </Card>
  );
};

export default AddFlight;
