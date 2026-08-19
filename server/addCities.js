import mongoose from 'mongoose';
import City from './models/City.js';
import dotenv from 'dotenv';
dotenv.config();

const addCities = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinereserve');
    console.log('Connected to DB');

    const citiesToAdd = ['Ranchi', 'Aurangabad', 'Gaya', 'Gurugram', 'Punjab'];

    for (const cityName of citiesToAdd) {
      const existing = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });
      if (!existing) {
        await new City({ name: cityName }).save();
        console.log(`Added city: ${cityName}`);
      } else {
        console.log(`City already exists: ${cityName}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addCities();
