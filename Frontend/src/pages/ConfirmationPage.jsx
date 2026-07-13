import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const confirmedBooking = location.state?.confirmedBooking;

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div>
        <Header />     

      <div>
        <h2 >Booking Confirmed</h2>
        <p>Thank you for the booking.</p>

        {confirmedBooking && (
          <div className="flight-summary-card">
            <p><strong>Booking ID:</strong> {confirmedBooking._id}</p>

            <p>
              <strong>Passenger:</strong>
              {confirmedBooking.firstName} {confirmedBooking.lastName}
            </p>

            <p>
              <strong>Flight:</strong>
              {confirmedBooking.flightAirline}
              ({confirmedBooking.flightNumber})
            </p>

            <p>
              <strong>Route:</strong>
              {confirmedBooking.sourceCity} → {confirmedBooking.destinationCity}
            </p>

            <p>
              <strong>Date:</strong> {confirmedBooking.journeyDate}
            </p>
          </div>
        )}

        <button className="btn-outlined" onClick={handleBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPage;