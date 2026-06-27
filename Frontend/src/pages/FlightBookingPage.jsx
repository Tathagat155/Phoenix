import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBookingApi } from "../services/API";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

const NAME_REGEX = /^[A-Za-z\s]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

const FlightBookingPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const selectedFlight = location.state?.selectedFlight;
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect back to search if no flight has been selected/searched yet
  React.useEffect(() => {
    if (!selectedFlight) {
      navigate("/flight-search");
    }
  }, [selectedFlight, navigate]);

  const validateField = (field, value) => {
    switch (field) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (!NAME_REGEX.test(value.trim()))
          return "Enter a valid first name (letters only)";
        return "";
      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (!NAME_REGEX.test(value.trim()))
          return "Enter a valid last name (letters only)";
        return "";
      case "email":
        if (!value.trim()) return "Email ID is required";
        if (!EMAIL_REGEX.test(value.trim()))
          return "Enter a valid email address";
        return "";
      case "mobileNumber":
        if (!value.trim()) return "Mobile number is required";
        if (!MOBILE_REGEX.test(value.trim()))
          return "Enter a valid 10-digit mobile number";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field, value) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errorMsg = validateField(field, value);
    setClientErrors((e) => ({ ...e, [field]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      email: validateField("email", email),
      mobileNumber: validateField("mobileNumber", mobileNumber),
    };
    setClientErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      mobileNumber: true,
    });

    const hasErrors = Object.values(newErrors).some((msg) => msg);
    if (hasErrors) return;

    const bookingPayload = {
      flightId: selectedFlight._id,
      flightAirline: selectedFlight.airline,
      flightNumber: selectedFlight.flightNumber,
      sourceCity: selectedFlight.sourceCity,
      destinationCity: selectedFlight.destinationCity,
      journeyDate: selectedFlight.journeyDate,
      firstName,
      lastName,
      email,
      mobileNumber,
    };

    try {
      setLoading(true);
      setServerErrors({});

      const data = await createBookingApi(bookingPayload);

      navigate("/confirmation", {
        state: {
          confirmedBooking: data.booking,
        },
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setServerErrors(error.response.data.errors);
      } else {
        setServerErrors({
          general: error.response?.data?.message || "Booking failed",
        });
      }
    } finally {
      setLoading(false);
    }

    if (!selectedFlight) {
      return null;
    }
  };
  return (
    <div>
      <Header />
      <div className="page-container">
        <h1 className="page-title">
          Booking Confirmation for Flight {selectedFlight.airline} (
          {selectedFlight.flightNumber})
        </h1>

        <div className="flight-summary-card">
          <p>
            <strong>Route:</strong> {selectedFlight.sourceCity} →{" "}
            {selectedFlight.destinationCity}
          </p>
          <p>
            <strong>Date:</strong> {selectedFlight.journeyDate}
          </p>
          <p>
            <strong>Departure:</strong> {selectedFlight.departureTime}{" "}
            &nbsp;|&nbsp; <strong>Arrival:</strong> {selectedFlight.arrivalTime}
          </p>
        </div>

        {serverErrors?.general && (
          <div className="alert-error">{serverErrors.general}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="underline-field">
            <label>
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => handleBlur("firstName", firstName)}
              className={
                touched.firstName && clientErrors.firstName ? "error" : ""
              }
            />
            {touched.firstName && clientErrors.firstName && (
              <div className="field-error">{clientErrors.firstName}</div>
            )}
          </div>

          <div className="underline-field">
            <label>
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => handleBlur("lastName", lastName)}
              className={
                touched.lastName && clientErrors.lastName ? "error" : ""
              }
            />
            {touched.lastName && clientErrors.lastName && (
              <div className="field-error">{clientErrors.lastName}</div>
            )}
          </div>

          <div className="underline-field">
            <label>
              Email ID <span className="required">*</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email", email)}
              className={touched.email && clientErrors.email ? "error" : ""}
            />
            {touched.email && clientErrors.email && (
              <div className="field-error">{clientErrors.email}</div>
            )}
          </div>

          <div className="underline-field">
            <label>
              Mobile Number <span className="required">*</span>
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))
              }
              onBlur={() => handleBlur("mobileNumber", mobileNumber)}
              className={
                touched.mobileNumber && clientErrors.mobileNumber ? "error" : ""
              }
              maxLength={10}
            />
            {touched.mobileNumber && clientErrors.mobileNumber && (
              <div className="field-error">{clientErrors.mobileNumber}</div>
            )}
          </div>

          <button type="submit" className="btn-filled" disabled={loading}>
            {loading ? "Confirming..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlightBookingPage;
