const Flight = require('../models/Flight');

// @desc Search flights matching source city, destination city
// (date is used only for display on the booking page — flights
// in this demo operate daily, so we don't filter by date)
// @route POST /api/flights/search
// @access Public
const searchFlights = async (req, res) => {
try {
const {sourceCity, destinationCity, journeyDate } = req.body;

if (!sourceCity || !destinationCity || !journeyDate) {
  return res.status(400).json({
    success: false,
    message: 'Source city, destination city and journey date are required',
  });
}

if (sourceCity === destinationCity) {
  return res.status(400).json({
    success: false,
    message: 'Source city and destination city cannot be the same',
  });
}

// Case-insensitive exact match on the route
const flights = await Flight.find({
  sourceCity: { $regex: `^${sourceCity}$`, $options: 'i' },
  destinationCity: { $regex: `^${destinationCity}$`, $options: 'i' },
}).sort({ departureTime: 1 });

if (flights.length === 0) {
  return res.status(200).json({
    success: true,
    message: 'No flights found for this route. Please try a different route.',
    flights: [],
    searchCriteria: {sourceCity, destinationCity, journeyDate },
  });
}

return res.status(200).json({
  success: true,
  flights,
  searchCriteria: {sourceCity, destinationCity, journeyDate },
});


} catch (error) {
console.error('Error searching flights:', error);
return res.status(500).json({
success: false,
message: 'Server error while searching flights',
});
}
};

// @desc Get a single flight by id (used when booking page loads
// directly, or to re-validate a selected flight)
// @route GET /api/flights/:id
// @access Public
const getFlightById = async (req, res) => {
try {
const flight = await Flight.findById(req.params.id);
if (!flight) {
return res.status(404).json({ success: false, message: 'Flight not found' });
}
return res.status(200).json({ success: true, flight });
} catch (error) {
console.error('Error fetching flight:', error);
return res.status(500).json({ success: false, message: 'Server error while fetching flight' });
}
};

module.exports = { searchFlights, getFlightById };