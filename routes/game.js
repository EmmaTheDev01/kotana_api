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
router.post('/create', verifyUser, createGame);
router.get('/available',verifyUser, getAvailableGames);
router.put('/join/:id', verifyUser, joinGameWithCode);
router.post('/update-score/:id', verifyUser, updateScore);
router.get('/:id', verifyUser, getGameDetails);
router.delete('/delete/:id', verifyUser, revokeGame);

export default router;
