const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tripRoutes = require('./routes/trips');
const tripUserRoutes=require("./routes/trip_user")
const organizationRoutes=require("./routes/trip_organization")
const test=require("./routes/firebase_table");
const tripChart = require("./routes/all_trip_info_chart")
const admin =require('firebase-admin');
const functions = require("firebase-functions");

admin.initializeApp();
dotenv.config('./.env');

const app =express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

async function connectDB() {
  try {
      await mongoose.connect(`mongodb://${process.env.URL}`, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
      });
      console.log('MongoDB connected...');
  } catch (err) {
      console.log(err.message);
      process.exit(1);
  }
};

connectDB()

app.get('/', function(req, res) {
  res.send("My routes Homepage")
})
//route
app.use('/', tripRoutes);
app.use('/', test);
app.use('/', tripChart);
app.use('/', tripUserRoutes);
app.use('/', organizationRoutes);

exports.api = functions.https.onRequest(app);
