import React, { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import Wrapper from "../../Helpers/Wrapper";
import AddFlight from "./AddFlight";
import RemoveFlight from "./RemoveFlight";
import ViewFlights from "./ViewFlights";

const AdminHome = (props) => {
  const [rSelected, setRSelected] = useState(1);

  const viewFlightsHandler = () => {
    setRSelected(1);
    window.open("/","_self")
  };

  const addFlightHandler = () => {
    setRSelected(2);
  };

  const removeFlightHandler = () => {
    setRSelected(3);
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
            Add Flight
          </Button>
          <Button
            color="primary"
            outline
            onClick={removeFlightHandler}
            active={rSelected === 3}
          >
            Remove Flight
          </Button>
        </ButtonGroup>
      </center>
      {rSelected === 1 && <ViewFlights />}
      {rSelected === 2 && <AddFlight />}
      {rSelected === 3 && <RemoveFlight />}
    </Wrapper>
  );
};

export default AdminHome;
