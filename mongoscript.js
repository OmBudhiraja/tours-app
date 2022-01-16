const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
const Reviews = require('./models/reviewsModal');
const User = require('./models/userModel');

dotenv.config({ path: './config.env' });

const dbConnectionUrl = process.env.DATABASE_URL;

mongoose
  .connect(dbConnectionUrl)
  .then(() => console.log('db connected'))
  .catch((err) => console.log('db connection error', err));

const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync('./dev-data/data/users.json', 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await Reviews.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();
