// Standalone script to seed the database with demo flights.
// Run with: npm run seed
const mongoose = require('mongoose');
require('dotenv').config();
const Flight = require('./models/Flight');

const MONGO_URI = process.env.MONGO_URI

const demoFlights = [
{ airline: 'Phoenix Airlines', flightNumber: 'PA-101', sourceCity: 'Delhi', destinationCity: 'Mumbai', departureTime: '06:00 AM', arrivalTime: '08:15 AM', duration: '2h 15m', price: 4500, totalSeats: 180 },
{ airline: 'Air India', flightNumber: 'AI-275', sourceCity: 'Delhi', destinationCity: 'Mumbai', departureTime: '08:00 AM', arrivalTime: '10:30 AM', duration: '2h 30m', price: 5200, totalSeats: 160 },
{ airline: 'IndiGo', flightNumber: '6E-342', sourceCity: 'Delhi', destinationCity: 'Mumbai', departureTime: '02:30 PM', arrivalTime: '04:45 PM', duration: '2h 15m', price: 4100, totalSeats: 186 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-202', sourceCity: 'Mumbai', destinationCity: 'Delhi', departureTime: '07:00 AM', arrivalTime: '09:10 AM', duration: '2h 10m', price: 4600, totalSeats: 180 },
{ airline: 'Vistara', flightNumber: 'UK-955', sourceCity: 'Mumbai', destinationCity: 'Delhi', departureTime: '06:15 PM', arrivalTime: '08:30 PM', duration: '2h 15m', price: 5400, totalSeats: 158 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-310', sourceCity: 'Delhi', destinationCity: 'Bengaluru', departureTime: '09:00 AM', arrivalTime: '11:45 AM', duration: '2h 45m', price: 5800, totalSeats: 180 },
{ airline: 'IndiGo', flightNumber: '6E-560', sourceCity: 'Delhi', destinationCity: 'Bengaluru', departureTime: '01:00 PM', arrivalTime: '03:50 PM', duration: '2h 50m', price: 5300, totalSeats: 186 },

{ airline: 'Air India', flightNumber: 'AI-503', sourceCity: 'Bengaluru', destinationCity: 'Delhi', departureTime: '05:30 AM', arrivalTime: '08:20 AM', duration: '2h 50m', price: 5900, totalSeats: 160 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-415', sourceCity: 'Mumbai', destinationCity: 'Chennai', departureTime: '10:30 AM', arrivalTime: '12:30 PM', duration: '2h 00m', price: 4800, totalSeats: 180 },
{ airline: 'SpiceJet', flightNumber: 'SG-720', sourceCity: 'Mumbai', destinationCity: 'Chennai', departureTime: '04:00 PM', arrivalTime: '06:00 PM', duration: '2h 00m', price: 4400, totalSeats: 189 },

{ airline: 'IndiGo', flightNumber: '6E-880', sourceCity: 'Chennai', destinationCity: 'Mumbai', departureTime: '11:00 AM', arrivalTime: '01:05 PM', duration: '2h 05m', price: 4700, totalSeats: 186 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-521', sourceCity: 'Delhi', destinationCity: 'Kolkata', departureTime: '07:45 AM', arrivalTime: '10:00 AM', duration: '2h 15m', price: 5100, totalSeats: 180 },
{ airline: 'Vistara', flightNumber: 'UK-712', sourceCity: 'Kolkata', destinationCity: 'Delhi', departureTime: '03:15 PM', arrivalTime: '05:35 PM', duration: '2h 20m', price: 5300, totalSeats: 158 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-630', sourceCity: 'Bengaluru', destinationCity: 'Hyderabad', departureTime: '08:30 AM', arrivalTime: '09:45 AM', duration: '1h 15m', price: 3200, totalSeats: 180 },
{ airline: 'IndiGo', flightNumber: '6E-115', sourceCity: 'Hyderabad', destinationCity: 'Bengaluru', departureTime: '12:00 PM', arrivalTime: '01:15 PM', duration: '1h 15m', price: 3100, totalSeats: 186 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-745', sourceCity: 'Pune', destinationCity: 'Delhi', departureTime: '06:30 AM', arrivalTime: '08:50 AM', duration: '2h 20m', price: 4900, totalSeats: 180 },
{ airline: 'Air India', flightNumber: 'AI-318', sourceCity: 'Delhi', destinationCity: 'Pune', departureTime: '05:00 PM', arrivalTime: '07:20 PM', duration: '2h 20m', price: 5000, totalSeats: 160 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-860', sourceCity: 'Ahmedabad', destinationCity: 'Mumbai', departureTime: '09:15 AM', arrivalTime: '10:30 AM', duration: '1h 15m', price: 3500, totalSeats: 180 },
{ airline: 'SpiceJet', flightNumber: 'SG-410', sourceCity: 'Mumbai', destinationCity: 'Ahmedabad', departureTime: '02:00 PM', arrivalTime: '03:15 PM', duration: '1h 15m', price: 3400, totalSeats: 189 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-975', sourceCity: 'Goa', destinationCity: 'Mumbai', departureTime: '11:30 AM', arrivalTime: '12:45 PM', duration: '1h 15m', price: 3800, totalSeats: 180 },
{ airline: 'IndiGo', flightNumber: '6E-630', sourceCity: 'Mumbai', destinationCity: 'Goa', departureTime: '07:00 PM', arrivalTime: '08:15 PM', duration: '1h 15m', price: 3700, totalSeats: 186 },

{ airline: 'Phoenix Airlines', flightNumber: 'PA-188', sourceCity: 'Jaipur', destinationCity: 'Delhi', departureTime: '08:00 AM', arrivalTime: '09:00 AM', duration: '1h 00m', price: 2900, totalSeats: 180 },
{ airline: 'Vistara', flightNumber: 'UK-499', sourceCity: 'Delhi', destinationCity: 'Jaipur', departureTime: '06:45 PM', arrivalTime: '07:45 PM', duration: '1h 00m', price: 3000, totalSeats: 158 },
];

const seedDatabase = async () => {
try {
await mongoose.connect(MONGO_URI);
console.log('MongoDB connected for seeding...');

await Flight.deleteMany({});
console.log('Existing flights cleared.');

const flights = await Flight.insertMany(demoFlights);
console.log(`${flights.length} demo flights seeded successfully!`);

await mongoose.connection.close();
console.log('Done. Connection closed.');
process.exit(0);


} catch (error) {
console.error('Error seeding database:', error.message);
process.exit(1);
}
};

seedDatabase();