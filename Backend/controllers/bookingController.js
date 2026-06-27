const Booking = require('../models/Booking');

// @desc Create a new booking
// @route POST /api/bookings
// @access Public
const createBooking = async (req, res) => {
try {
const {
flightId,
flightAirline,
flightNumber,
sourceCity,
destinationCity,
journeyDate,
firstName,
lastName,
email,
mobileNumber,
} = req.body;

// Backend validation (mirrors frontend validation, never trust client only)
const errors = {};

if (!firstName || firstName.trim().length < 2) {
  errors.firstName = 'First name must be at least 2 characters';
}
if (!lastName || lastName.trim().length < 2) {
  errors.lastName = 'Last name must be at least 2 characters';
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
  errors.email = 'Please enter a valid email address';
}
const mobileRegex = /^[6-9]\d{9}$/;
if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
  errors.mobileNumber = 'Please enter a valid 10-digit mobile number';
}
if (!flightAirline || !flightNumber || !sourceCity || !destinationCity || !journeyDate) {
  errors.flight = 'Flight details are missing. Please search for a flight again.';
}

if (Object.keys(errors).length > 0) {
  return res.status(400).json({ success: false, errors });
}

const booking = await Booking.create({
  flightId: flightId,
  flightAirline,
  flightNumber,
  sourceCity,
  destinationCity,
  journeyDate,
  firstName: firstName.trim(),
  lastName: lastName.trim(),
  email: email.trim().toLowerCase(),
  mobileNumber: mobileNumber.trim(),
  bookingStatus: 'confirmed',
});

return res.status(201).json({
  success: true,
  message: 'Booking confirmed successfully',
  booking,
});


} catch (error) {
console.error('Error creating booking:', error);
return res.status(500).json({
success: false,
message: 'Server error while creating booking',
});
}
};

// @desc Get booking by id
// @route GET /api/bookings/:id
// @access Public
const getBookingById = async (req, res) => {
try {
const booking = await Booking.findById(req.params.id);
if (!booking) {
return res.status(404).json({ success: false, message: 'Booking not found' });
}
return res.status(200).json({ success: true, booking });
} catch (error) {
console.error('Error fetching booking:', error);
return res.status(500).json({ success: false, message: 'Server error while fetching booking' });
}
};

// @desc Get all bookings
// @route GET /api/bookings
// @access Public
const getAllBookings = async (req, res) => {
try {
const bookings = await Booking.find().sort({ createdAt: -1 });
return res.status(200).json({ success: true, bookings });
} catch (error) {
console.error('Error fetching bookings:', error);
return res.status(500).json({ success: false, message: 'Server error while fetching bookings' });
}
};

module.exports = { createBooking, getBookingById, getAllBookings };