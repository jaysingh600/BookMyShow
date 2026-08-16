import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cinereserve');
    console.log('Connected to DB');

    let admin = await User.findOne({ email: 'admin@cinereserve.com' });
    if (admin) {
      console.log('Admin already exists.');
      // If it exists but is not admin role
      if (admin.role !== 'ADMIN') {
        admin.role = 'ADMIN';
        await admin.save();
        console.log('Updated to ADMIN role.');
      }
    } else {
      admin = new User({
        name: 'Admin User',
        email: 'admin@cinereserve.com',
        password: 'password123',
        phone: '1234567890',
        role: 'ADMIN'
      });
      await admin.save();
      console.log('Created new Admin user.');
    }
    
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@cinereserve.com');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
