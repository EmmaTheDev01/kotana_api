// routes/gameRoutes.js

import express from 'express';
import {
  createGame,
  getAvailableGames,
  updateScore,
  getGameDetails,
  joinGameWithCode,
  revokeGame,
} from '../controllers/gameController.js'; // Adjust the path based on your project structure
import { verifyToken, verifyUser } from '../utils/verifyToken.js'; // Adjust the path based on your project structure

const router = express.Router();

// Middleware to verify the user's token for protected routes
router.use(verifyToken);

// Routes for games
router.post('/create', createGame);
router.get('/available', getAvailableGames);
router.put('/join/:code', joinGameWithCode);
router.put('/score/:code', updateScore);
router.get('/:id', getGameDetails);
router.delete('/delete/:id', revokeGame);

export default router;
