const fs = require('fs');
const mongoose = require('mongoose');
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connect successfully'));

// reaf json file

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into db

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data sucessfuly loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete all from db collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data sucessfuly delated');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//load from tours-simple => node dev-data/data/import-dev-data.js --import
//deleteAll => node dev-data/data/import-dev-data.js --delete
