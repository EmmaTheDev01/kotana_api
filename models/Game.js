// game.js

import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  playerOne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  playerTwo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
