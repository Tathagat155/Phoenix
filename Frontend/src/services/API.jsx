import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API = axios.create({
  baseURL: API_URL,
});
// Search flights based on source, destination and date export
export const searchFlightsApi = async (searchData) => {
  const response = await API.post("/flights/search", searchData);
  return response.data;
}; // Create a booking export

export const createBookingApi = async (bookingData) => {
  const response = await API.post("/bookings", bookingData);
  return response.data;
};

export default API;