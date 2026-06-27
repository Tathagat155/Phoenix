const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
const PORT=process.env.PORT || 3000
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log("Server Started");
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
