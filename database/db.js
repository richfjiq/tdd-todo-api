const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL ?? '');
  } catch (error) {
    console.error('Error connecting to mongoDB');
    console.error(error);
  }
};

module.exports = {
  connect,
};
