import React, { useState, useContext } from "react";
import {
  Card,
  CardImg,
  CardTitle,
  CardBody,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Button,
} from "reactstrap";
import Wrapper from "../../Helpers/Wrapper";
import image from "../../assets/login.jpg";
import AuthContext from "../../store/auth-context";

const SignIn = (props) => {
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isRepasswordInvalid, setIsRepasswordInvalid] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const emailChangeHandler = (event) => {
    var regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

    setEmail(event.target.value.trim());
    setIsEmailInvalid(!String(event.target.value.trim()).match(regex));
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value.trim());
    setIsPasswordInvalid(event.target.value.trim().length < 8);
  };

  const repasswordChangeHandler = (event) => {
    setRepassword(event.target.value.trim());
    setIsRepasswordInvalid(event.target.value.trim() !== password);
  };

  const toggleSignInHandler = () => {
    setEmail("");
    setPassword("");
    setRepassword("");
    setIsEmailInvalid(false);
    setIsPasswordInvalid(false);
    setIsRepasswordInvalid(false);
    setError(null);
    setIsSignUp(!isSignUp);
  };

  const authCtx = useContext(AuthContext);

  const signInHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    let body = {
      email: email,
      password: password,
    };
    try {
      let url;
      if (isSignUp) url = "https://flight-06ee.onrender.com/signup";
      else url = "https://flight-06ee.onrender.com/login";
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (isSignUp) {
        if (response.status === 201) {
          window.alert("User Added!! Login to continue");
          window.open("/", "_self");
        } else if (response.status === 200) {
          setError(data["message"]);
        }
      } else {
        if (response.status === 200) {
          window.localStorage.setItem("accessToken", data["token"]);
          authCtx.onLogin(data["role"]);
        } else if (response.status === 401) {
          setError("Invalid username or password");
        }
      }
    } catch (error) {
      setError("An error occured");
    }
    setIsLoading(false);
  };

  let content;
  if (isSignUp) content = "Sign Up";
  if (!isSignUp) content = "Login";
  if (isLoading) content = "Loading...";

  return (
    <Wrapper>
      <Card
        className="my-2"
        style={{ width: "30%", marginLeft: "auto", marginRight: "auto" }}
      >
        <CardImg
          src={image}
          style={{
            height: 180,
          }}
          top
          width="100%"
        />
        <CardBody>
          <CardTitle tag="h5">
            <center>
              <b>{!isSignUp ? "Login" : "Sign Up"}</b>
            </center>
          </CardTitle>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              value={email}
              invalid={isEmailInvalid}
              type="email"
              onChange={emailChangeHandler}
            />
            <FormFeedback>Enter valid email id</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              value={password}
              invalid={isPasswordInvalid}
              type="password"
              onChange={passwordChangeHandler}
            />
            <FormFeedback>
              {isSignUp && "Password should be 8 characters long"}
            </FormFeedback>
          </FormGroup>
          {isSignUp && (
            <FormGroup>
              <Label for="repassword">Re-enter Password</Label>
              <Input
                value={repassword}
                invalid={isRepasswordInvalid}
                type="password"
                onChange={repasswordChangeHandler}
              />
              <FormFeedback>
                {isSignUp && "Password doesn't match"}
              </FormFeedback>
            </FormGroup>
          )}
          <center>
            <p style={{ color: "red" }}>{error}</p>
            <Button
              color="primary"
              onClick={signInHandler}
              disabled={
                email === "" ||
                password === "" ||
                isEmailInvalid ||
                isPasswordInvalid ||
                (isSignUp && isRepasswordInvalid)
              }
            >
              {content}
            </Button>
          </center>
        </CardBody>
        <Button color="link" onClick={toggleSignInHandler}>
          {!isSignUp ? "Sign Up Instead" : "Existing User?? Login"}
        </Button>
      </Card>
    </Wrapper>
  );
};

export default SignIn;
