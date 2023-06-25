import React, { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import Wrapper from "../../Helpers/Wrapper";
import Home from "./Home";
import ViewTickets from "./ViewTickets";

const AdminHome = (props) => {
  const [rSelected, setRSelected] = useState(1);

  const viewFlightsHandler = () => {
    setRSelected(1);
    window.open("/", "_self");
  };

  const addFlightHandler = () => {
    setRSelected(2);
  };

  return (
    <Wrapper>
      <center>
        <ButtonGroup style={{ marginBottom: "20px" }}>
          <Button
            color="primary"
            outline
            onClick={viewFlightsHandler}
            active={rSelected === 1}
          >
            View Flights
          </Button>
          <Button
            color="primary"
            outline
            onClick={addFlightHandler}
            active={rSelected === 2}
          >
            View Bookings
          </Button>
        </ButtonGroup>
      </center>
      {rSelected === 1 && <Home />}
      {rSelected === 2 && <ViewTickets />}
    </Wrapper>
  );
};

export default AdminHome;
