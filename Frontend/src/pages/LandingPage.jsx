import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {" "}
      <Header />{" "}
      <div className="page-container">
        {" "}
        <h1 className="page-title">Welcome to Flight Booking App</h1>{" "}
        <button
          className="btn-outlined"
          onClick={() => navigate("/flight-search")}
        >
          {" "}
          Search Flights Here{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
};
export default LandingPage;
