// routes/gameRoutes.js

import express from 'express';
import {
  createGame,
  getAvailableGames,
  joinGame,
  updateScore,
  getGameDetails,
} from '../controllers/gameController.js'; // Adjust the path based on your project structure
import { verifyToken } from '../utils/verifyToken.js'; // Adjust the path based on your project structure

const router = express.Router();

// Middleware to verify the user's token for protected routes
router.use(verifyToken);

// Routes for games
router.post('/create', createGame);
router.get('/available', getAvailableGames);
router.post('/join/:gameId', joinGame);
router.post('/update-score/:gameId', updateScore);
router.get('/:gameId', getGameDetails);

export default router;
