import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { searchFlightsApi } from "../services/API";

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Goa",
  "Jaipur",
];

// Helper: returns today's date in yyyy-mm-dd for the min attribute on date input
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const getMaxDateString = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const yyyy = maxDate.getFullYear();
  const mm = String(maxDate.getMonth() + 1).padStart(2, "0");
  const dd = String(maxDate.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

// Convert yyyy-mm-dd (input value) -> dd/mm/yyyy (display/storage format)
const toDisplayDate = (isoDate) => {
  if (!isoDate) return "";
  const [yyyy, mm, dd] = isoDate.split("-");
  return `${dd}/${mm}/${yyyy}`;
};

const FlightSearchPage = () => {
  const navigate = useNavigate();
const [searchCriteria, setSearchCriteria] = useState({
  sourceCity: "",
  destinationCity: "",
  journeyDate: "",
});

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceCity, setSourceCity] = useState(searchCriteria.sourceCity || "");
  const [destinationCity, setDestinationCity] = useState(
    searchCriteria.destinationCity || "",
  );
  const [journeyDateIso, setJourneyDateIso] = useState("");
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");

  const isFormValid =
    sourceCity &&
    destinationCity &&
    sourceCity !== destinationCity &&
    journeyDateIso;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      sourceCity: true,
      destinationCity: true,
      journeyDate: true,
      returnDate: true,
    });

    if (!sourceCity || !destinationCity) {
      setFormError("Please select both source and destination cities.");
      return;
    }
    if (sourceCity === destinationCity) {
      setFormError("Source city and destination city cannot be the same.");
      return;
    }
    if (!journeyDateIso) {
      setFormError("Please select a journey date.");
      return;
    }
    setFormError("");

    const journeyDate = toDisplayDate(journeyDateIso);
    const searchPayload = {
      sourceCity,
      destinationCity,
      journeyDate
    };
    setSearchCriteria(searchPayload);

    try {
      setLoading(true);
      setError("");

      const data = await searchFlightsApi(searchPayload);

      setSearchResults(data.flights);
      setHasSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search flights");
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    navigate("/flight-booking", {
      state: {
        selectedFlight: {
          ...flight,
          journeyDate: searchCriteria.journeyDate,
  
        },
      },
    });
  };

  return (
    <div>
      <Header />
      <div className="page-container wide">
        {(formError || error) && (
          <div className="alert-error">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-field">
            <div className="select-wrapper">
              <select
                className={`form-select ${
                  touched.sourceCity && !sourceCity ? "error" : ""
                }`}
                value={sourceCity}
                onChange={(e) => setSourceCity(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, sourceCity: true }))}
              >
                <option value="">Source City</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {touched.sourceCity && !sourceCity && (
              <div className="field-error">Source city is required</div>
            )}
          </div>

          <div className="form-field">
            <div className="select-wrapper">
              <select
                className={`form-select ${
                  touched.destinationCity && !destinationCity ? "error" : ""
                }`}
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({ ...t, destinationCity: true }))
                }
              >
                <option value="">Destination City</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            {touched.destinationCity && !destinationCity && (
              <div className="field-error">Destination city is required</div>
            )}
            {sourceCity &&
              destinationCity &&
              sourceCity === destinationCity && (
                <div className="field-error">
                  Destination cannot be same as source
                </div>
              )}
          </div>

          <div className="date-field-wrapper">
            <span className="field-label">Journey Date</span>
            <div className="date-input-row">
              <input
                type="date"
                min={getTodayString()}
                max={getMaxDateString()}
                value={journeyDateIso}
                onChange={(e) => setJourneyDateIso(e.target.value)}
              />
            </div>
            {touched.journeyDate && !journeyDateIso && (
              <div className="field-error">Journey date is required</div>
            )}
          </div>

          <button
            type="submit"
            className="btn-filled"
            disabled={!isFormValid || loading}
          >
            {loading ? "Searching..." : "Search Flight"}
          </button>
          {loading && (
            <div className="loading-text">Finding flights for you...</div>
          )}
        </form>

        {hasSearched && !loading && (
          <div className="search-results-section">
            <h2 className="results-heading">
              {searchResults.length > 0
                ? `${searchResults.length} Flight${searchResults.length > 1 ? "s" : ""} Found — ${searchCriteria.sourceCity} to ${searchCriteria.destinationCity}`
                : "No flights found"}
            </h2>

            {searchResults.length === 0 && (
              <p className="no-results-text">
                No flights available for this route right now. Try a different
                source/destination combination.
              </p>
            )}

            {searchResults.map((flight) => (
              <div className="flight-result-card" key={flight._id}>
                <div className="flight-result-main">
                  <div className="flight-result-airline">
                    <strong>{flight.airline}</strong>
                    <span className="flight-number">{flight.flightNumber}</span>
                  </div>
                  <div className="flight-result-route">
                    <span>{flight.departureTime}</span>
                    <span className="route-arrow">→</span>
                    <span>{flight.arrivalTime}</span>
                  </div>
                  <div className="flight-result-duration">
                    {flight.duration}
                  </div>
                  <div className="flight-result-price">₹{flight.price}</div>
                </div>
                <button
                  className="btn-filled book-flight"
                  onClick={() => handleSelectFlight(flight)}
                >
                  Book Flight
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;

