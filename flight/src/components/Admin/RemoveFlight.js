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

const RemoveFlight = (props) => {
  const ctx = useContext(AuthContext);
  const [flight, setFlight] = useState();
  const [isFlightInvalid, setIsFlightInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  const [error, setError] = useState(null);

  const dateChangeHandler = (event) => {
    setDate(event.target.value);
  };
  const flightChangeHandler = (event) => {
    setFlight(event.target.value);
    setIsFlightInvalid(event.target.value <= 0);
  };

  const removeFlightHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const body = {
        flight_id: flight,
        given_date: date,
      };

      const response = await fetch("http://localhost:8080/remove-flight", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        console.log(data["message"]);
        if (data["message"].includes("Flight trips cancelled")) {
          window.alert(data["message"]);
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
  const getTodayDate = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
  };

  return (
    <Card
      className="my-2"
      style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
    >
      <CardBody>
        <FormGroup>
          <Label for="flight">Flight Id</Label>
          <Input
            disabled={isLoading}
            min={1}
            value={flight}
            invalid={isFlightInvalid}
            type="number"
            onChange={flightChangeHandler}
          />
          <FormFeedback>Enter valid flight number</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="date">Cancel flight (from date)</Label>
          <Input
            disabled={isLoading}
            min={getTodayDate()}
            type="date"
            onChange={dateChangeHandler}
            value={date}
          />
        </FormGroup>
      </CardBody>
      <Button color="primary"
        onClick={removeFlightHandler}
        disabled={isFlightInvalid || date === undefined}
      >
        {isLoading ? "Removing Flight..." : "Remove Flight"}
      </Button>
      <center>
        <p style={{ color: "red" }}>{error}</p>
      </center>
    </Card>
  );
};

export default RemoveFlight;
