import City from '../models/City.js';
import Theatre from '../models/Theatre.js';
import Auditorium from '../models/Auditorium.js';

export const addCity = async (req, res) => {
  try {
    const { name, image, isActive } = req.body;
    const newCity = new City({ name, image, isActive });
    await newCity.save();
    res.status(201).json({ success: true, city: newCity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTheatre = async (req, res) => {
  try {
    const { name, city, address, images, isActive } = req.body;
    const newTheatre = new Theatre({ name, city, address, images, isActive });
    await newTheatre.save();
    res.status(201).json({ success: true, theatre: newTheatre });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate('city');
    res.status(200).json({ success: true, theatres });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAuditorium = async (req, res) => {
  try {
    const { name, theatre, rows, columns, rowCategories, blockedSeats, disabledSeats } = req.body;
    const newAuditorium = new Auditorium({
      name, theatre, rows, columns, rowCategories, blockedSeats, disabledSeats
    });
    await newAuditorium.save();
    res.status(201).json({ success: true, auditorium: newAuditorium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditoriums = async (req, res) => {
  try {
    const auditoriums = await Auditorium.find().populate({
      path: 'theatre',
      populate: { path: 'city' }
    });
    res.status(200).json({ success: true, auditoriums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
