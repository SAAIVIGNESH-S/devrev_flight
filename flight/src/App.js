import React, { useContext } from "react";

import UserHome from "./components/Home/UserHome";
import MainHeader from "./components/MainHeader/MainHeader";
import AuthContext from "./store/auth-context";
import SignIn from "./components/Login/SignIn";
import AdminHome from "./components/Admin/AdminHome";
import { Spinner } from "reactstrap";

function App() {
  const ctx = useContext(AuthContext);
  return (
    <React.Fragment>
      <MainHeader />
      <main>
        {ctx.status === "loading" ? (
          <center>
            <Spinner />
          </center>
        ) : ctx.status === "succeeded" ? (
          ctx.role === "user" ? (
            <UserHome />
          ) : (
            <AdminHome />
          )
        ) : (
          <SignIn />
        )}
      </main>
    </React.Fragment>
  );
}

export default App;
