import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  role: "",
  status: "idle",
  onLogin: (role) => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    setStatus("loading");
    fetch("https://flight-06ee.onrender.com/check-token", {
      method: "POST",
      body: JSON.stringify({ token: accessToken }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setRole(data["role"]);
            setStatus("succeeded");
          });
        } else if (response.status === 401) {
          setStatus("failed");
        }
      })
      .catch((err) => {
        setStatus("failed");
      });
  }, []);

  const loginHandler = (role) => {
    setRole(role);
    setStatus("succeeded");
  };
  const logoutHandler = () => {
    localStorage.clear();
    setRole("");
    setStatus("idle");
  };
  return (
    <AuthContext.Provider
      value={{
        role: role,
        status: status,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
