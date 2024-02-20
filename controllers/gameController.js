// gameController.js

import Game from '../models/Game.js';
import Score from '../models/Score.js';
import User from '../models/User.js';

// Controller function to create a new game
export const createGame = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;

        // Check if the user is already in a game
        const existingGame = await Game.findOne({
            players: currentPlayerId,
            status: { $in: ['pending', 'ongoing'] },
        });

        if (existingGame) {
            return res.status(400).json({
                success: false,
                message: 'You are already in a game',
            });
        }

        // Create a new game with the current player as the first participant
        const newGame = await Game.create({ players: [currentPlayerId] });

        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            gameId: newGame._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Controller function to retrieve available games for a user to join
export const getAvailableGames = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;

        // Find games with status 'pending' that do not already have the current player
        const availableGames = await Game.find({
            status: 'pending',
            players: { $ne: currentPlayerId },
        });

        res.status(200).json({
            success: true,
            games: availableGames,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Controller function to join an existing game
export const joinGame = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;
        const gameId = req.params.gameId;

        // Find the game by ID
        const game = await Game.findById(gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        // Check if the game already has two players
        if (game.players.length >= 2) {
            return res.status(400).json({
                success: false,
                message: 'Game is already full',
            });
        }

        // Check if the current player is already in the game
        if (game.players.includes(currentPlayerId)) {
            return res.status(400).json({
                success: false,
                message: 'You are already in the game',
            });
        }

        // Add the current player to the game
        game.players.push(currentPlayerId);

        // Check if the game now has two players, then start the game
        if (game.players.length === 2) {
            game.status = 'ongoing';
        }

        await game.save();

        res.status(200).json({
            success: true,
            message: 'Successfully joined the game',
            updatedGame: game,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
// Controller function to update the score within a game
export const updateScore = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;
        const gameId = req.params.gameId;
        const { score } = req.body;

        // Create or update the score for the current player in the Score schema
        let userScore = await Score.findOne({ user: currentPlayerId });

        if (!userScore) {
            userScore = await Score.create({ user: currentPlayerId, score });
        } else {
            userScore.score = score;
            await userScore.save();
        }

        // Find the game by ID and update the score for the current player
        const updatedGame = await Game.findOneAndUpdate(
            { _id: gameId, players: currentPlayerId, status: 'ongoing' },
            { $addToSet: { scores: userScore._id } },
            { new: true }
        );

        if (!updatedGame) {
            return res.status(404).json({
                success: false,
                message: 'Game not found or not ongoing',
            });
        }

        // Check for winning condition
        const winningPlayerId = await Score.findOne({
            _id: userScore._id,
            score: { $gte: 70 },
        });

        if (winningPlayerId) {
            updatedGame.status = 'completed';
            updatedGame.winner = currentPlayerId;
            await updatedGame.save();
        }

        res.status(200).json({
            success: true,
            message: 'Score updated successfully',
            updatedGame,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Controller function to get game details, including scores of players
export const getGameDetails = async (req, res) => {
    try {
        const gameId = req.params.gameId;

        // Find the game by ID and populate player details
        const gameDetails = await Game.findById(gameId).populate('players', 'username');

        if (!gameDetails) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        res.status(200).json({
            success: true,
            gameDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


