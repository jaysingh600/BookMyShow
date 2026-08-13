import City from '../models/City.js';
import Theatre from '../models/Theatre.js';
import Auditorium from '../models/Auditorium.js';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

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

export const addMovie = async (req, res) => {
  try {
    const { title, description, language, genre, duration, posterUrl, isActive } = req.body;
    const newMovie = new Movie({ title, description, language, genre, duration, posterUrl, isActive });
    await newMovie.save();
    res.status(201).json({ success: true, movie: newMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movie, theatre, auditorium, date, startTime, endTime, pricing, isPublished } = req.body;
    const newShow = new Show({
      movie, theatre, auditorium, date, startTime, endTime, pricing, isPublished
    });
    await newShow.save();
    res.status(201).json({ success: true, show: newShow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate('movie')
      .populate('theatre')
      .populate('auditorium');
    res.status(200).json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
