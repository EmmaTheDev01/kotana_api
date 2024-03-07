// routes/gameRoutes.js

import express from 'express';
import {
  createGame,
  getAvailableGames,
  updateScore,
  getGameDetails,
  joinGameWithCode,
} from '../controllers/gameController.js'; // Adjust the path based on your project structure
import { verifyToken, verifyUser } from '../utils/verifyToken.js'; // Adjust the path based on your project structure

const router = express.Router();

// Middleware to verify the user's token for protected routes
router.use(verifyToken);

// Routes for games
router.post('/create',verifyUser, createGame);
router.get('/available', getAvailableGames);
router.post('/join/:gameId', joinGameWithCode);
router.post('/update-score/:gameId', updateScore);
router.get('/:gameId', getGameDetails);

export default router;
