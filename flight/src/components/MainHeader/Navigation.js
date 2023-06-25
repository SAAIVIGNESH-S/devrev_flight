import React, { useContext } from "react";

import classes from "./Navigation.module.css";
import AuthContext from "../../store/auth-context";

const Navigation = () => {
  const ctx = useContext(AuthContext);

  return (
    <nav className={classes.nav}>
      <ul>
        {ctx.status === "succeeded" && (
          <li>
            <button onClick={ctx.onLogout} style={{backgroundColor:"blue"}}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
