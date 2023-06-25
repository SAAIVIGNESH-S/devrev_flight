import React, { useEffect, useState, useContext } from "react";
import { Spinner, Table } from "reactstrap";
import AuthContext from "../../store/auth-context";

const ViewTickets = (props) => {
  const ctx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState([]);
  const fetchBookingsHandler = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/user-view-booking", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + window.localStorage.getItem("accessToken"),
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setDetails(data["message"]);
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
  useEffect(() => {
    fetchBookingsHandler();
  }, []);
  return error ? (
    <center>
      <p style={{ color: "red" }}>{error}</p>
    </center>
  ) : isLoading ? (
    <center>
      <Spinner />
    </center>
  ) : details.length === 0 ? (
    <center>
      <h3>No Bookings Yet</h3>
    </center>
  ) : (
    <center>
      <Table bordered style={{ width: "75%" }}>
        <thead>
          <tr>
            <th>Ticket Id</th>
            <th>Flight Id</th>
            <th>Trip Date</th>
            <th>Trip Time</th>
            <th>Passenger Id</th>
            <th>Passenger Seat</th>
            <th>Payment Id</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail) => {
            return (
              <tr>
                <th scope="row">{detail["ticket_id"]}</th>
                <td>{detail["flight_id"]}</td>
                <td>{detail["trip_date"].split("T")[0]}</td>
                <td>{detail["trip_date"].split("T")[1].substring(0, 5)}</td>
                <td>{detail["passenger_id"]}</td>
                <td>{detail["passenger_seat"]}</td>
                <td>{detail["payment_id"]}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </center>
  );
};

export default ViewTickets;
