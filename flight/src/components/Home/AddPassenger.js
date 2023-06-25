import React, { useState, useContext } from "react";
import Wrapper from "../../Helpers/Wrapper";
import { Row, Col, Input, Label, FormGroup, Form, Button } from "reactstrap";
import AuthContext from "../../store/auth-context";

const AddPassenger = (props) => {
  const ctx = useContext(AuthContext);
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const nameChangeHandler = (event) => {
    var regex = /^\d{10}$/;
    setName(event.target.value);
    if (event.target.value.trim().length > 0 && gender && regex.test(phone))
      setIsDisabled(false);
    else setIsDisabled(true);
  };
  const genderChangeHandler = (event) => {
    var regex = /^\d{10}$/;
    setGender(event.target.value);
    if (name.trim().length > 0 && event.target.value && regex.test(phone))
      setIsDisabled(false);
    else setIsDisabled(true);
  };
  const phoneChangeHandler = (event) => {
    var regex = /^\d{10}$/;
    setPhone(event.target.value);
    if (name.trim().length > 0 && gender && regex.test(event.target.value))
      setIsDisabled(false);
    else setIsDisabled(true);
  };
  const addPassengerHandler = async () => {
    setIsLoading(true);
    try {
      const passenger = {
        passenger_name: name,
        gender: gender,
        phone: phone,
      };

      const response = await fetch("https://flight-06ee.onrender.com/add-passenger", {
        method: "POST",
        body: JSON.stringify(passenger),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        if (data["message"] === "Passenger added") {
          setId(data["passenger_id"]);
          console.log(data["passenger_id"]);
          props.addId(data["passenger_id"]);
          setIsSuccess(true);
        }
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
  let content;
  if (isDisabled) content = "Enter valid details";
  if (!isDisabled) content = "Add passenger";
  if (isLoading) content = "Loading...";
  if (isSuccess) content = `Passenger Added (id: ${id})`;
  return (
    <Wrapper>
      <Row xs="4">
        <Col className="bg-light border">
          <Input
            disabled={isSuccess}
            onChange={nameChangeHandler}
            className="mb-3"
            placeholder="Passenger Name"
            style={{ width: "75%", margin: "2% auto" }}
          />
        </Col>
        <Col className="bg-light border">
          <center>
            <Form style={{ marginTop: "15px" }} onChange={genderChangeHandler}>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="gender"
                  value="male"
                  disabled={isSuccess}
                />
                <Label check>Male</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="gender"
                  value="female"
                  disabled={isSuccess}
                />
                <Label check>Female</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  type="radio"
                  name="gender"
                  value="others"
                  disabled={isSuccess}
                />
                <Label check>Others</Label>
              </FormGroup>
            </Form>
          </center>
        </Col>
        <Col className="bg-light border">
          <Input
            disabled={isSuccess}
            type="number"
            onChange={phoneChangeHandler}
            className="mb-3"
            placeholder="Phone Number"
            style={{ width: "75%", margin: "2% auto" }}
          />
        </Col>
        <Col className="bg-light border">
          <center>
            <Button
              color="primary"
              onClick={addPassengerHandler}
              disabled={isSuccess}
              style={{ marginTop: "12px" }}
            >
              {content}
            </Button>
          </center>
        </Col>
      </Row>
    </Wrapper>
  );
};

export default AddPassenger;
