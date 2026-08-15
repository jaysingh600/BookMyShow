import express from 'express';
import { 
  addCity, getCities, 
  addTheatre, getTheatres, 
  addAuditorium, getAuditoriums,
  addMovie, getMovies,
  addShow, getShows,
  getStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly accessible reads (or maybe they should be public if users need to see them, but for now we put them here)
// Actually, getCities and getTheatres might be needed by the public app, but let's keep them here for admin purposes.
// We can remove 'protect, admin' from GET if needed later.
router.get('/cities', getCities);
router.post('/cities', protect, admin, addCity);

router.get('/theatres', getTheatres);
router.post('/theatres', protect, admin, addTheatre);

router.get('/auditoriums', getAuditoriums);
router.post('/auditoriums', protect, admin, addAuditorium);

router.get('/movies', getMovies);
router.post('/movies', protect, admin, addMovie);

router.get('/shows', getShows);
router.post('/shows', protect, admin, addShow);

router.get('/stats', protect, admin, getStats);

export default router;
