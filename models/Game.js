import mongoose from 'mongoose';
import { generateRandomCode } from '../utils.js';

const gameSchema = new mongoose.Schema({
  players: [
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      position: { type: String, enum: ['player 1', 'player 2'], required: true },
    },
    { 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      position: { type: String, enum: ['player 1', 'player 2'], required: true },
    }
  ],
  scores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Score',
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending',
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  code: {
    type: String,
    required: true,
    default: () => generateRandomCode(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
