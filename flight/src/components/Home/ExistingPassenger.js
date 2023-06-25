import React, { useState } from "react";
import { Input, Row, Col, Button } from "reactstrap";

const ExistingPassenger = (props) => {
  const [value, setValue] = useState(0);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const changeHandler = (event) => {
    setValue(event.target.value);
    setIsInvalid(!(event.target.value > 0));
  };
  const addHandler = () => {
    if (!isInvalid) {
      console.log(value);
      props.addId(value);
      setIsDisabled(true);
    }
  };
  return (
    <Row xs="2" style={{ marginTop: "5px" }}>
      <Col className="bg-light ">
        <Input
          placeholder="Existing Passenger id"
          value={value}
          min={0}
          invalid={isInvalid}
          disabled={isDisabled}
          type="number"
          onChange={changeHandler}
        />
      </Col>
      <Col className="bg-light ">
        <Button color="primary" disabled={isDisabled} onClick={addHandler}>
          Confirm
        </Button>
      </Col>
    </Row>
  );
};

export default ExistingPassenger;
