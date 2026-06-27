import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FlightSearchPage from "./pages/FlightSearchPage";
import FlightBookingPage from "./pages/FlightBookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
   
      <Routes>
      
        <Route path="/" element={<LandingPage />} />
        <Route path="/flight-search" element={<FlightSearchPage />} />
        <Route path="/flight-booking" element={<FlightBookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
