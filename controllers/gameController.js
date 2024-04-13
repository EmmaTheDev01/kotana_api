// gameController.js
import { generateRandomCode } from '../utils.js';
import Game from '../models/Game.js';
import Score from '../models/Score.js';
import User from '../models/User.js';
// Controller function to create a new game
export const createGame = async (req, res) => {
    try {
        // Ensure that req.user is properly set
        if (!req.user || !req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const currentPlayerId = req.user.id;

        // Check if the current player is already in a game
        const existingGame = await Game.findOne({
            $or: [
                { 'players.0.userId': currentPlayerId, status: { $in: ['pending', 'ongoing'] } },
                { 'players.1.userId': currentPlayerId, status: { $in: ['pending', 'ongoing'] } }
            ]
        });

        if (existingGame) {
            return res.status(400).json({
                success: false,
                message: 'You are already in a game',
            });
        }

        const newGame = await Game.create({
            players: [{ userId: currentPlayerId, position: 'player 1' }],
            status: 'pending',
        });

        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            gameId: newGame._id,
            code: newGame.code,
        });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create game',
        });
    }
};
export const joinGameWithCode = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;
        const { code } = req.params; // Extract the game code from the URL parameters

        // Find the game by code
        const game = await Game.findOne({ code: code });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        // Check if the current player is already in the game
        if (game.players.some(player => player.userId.toString() === currentPlayerId)) {
            return res.status(400).json({
                success: false,
                message: 'You are already in the game',
            });
        }

        // Check if the game is full
        if (game.players.length >= 2) {
            return res.status(400).json({
                success: false,
                message: 'The game is full',
            });
        }

        // Update the game status and other details
        game.status = 'ongoing'; // Update the game status to ongoing
        game.players.push({ userId: currentPlayerId, position: 'player 2' });

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
            error: error.message,
        });
    }
};


// Controller function to update the score within a game
export const updateScore = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;
        const gameId = req.params.gameId;
        const { score } = req.body;

        let userScore = await Score.findOneAndUpdate(
            { user: currentPlayerId },
            { user: currentPlayerId, score },
            { upsert: true, new: true }
        );

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

        const winningScore = 50;
        if (score >= winningScore) {
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
//getting all available games which are not full yet
export const getAvailableGames = async (req, res) => {
    try {
        // Ensure that req.user is properly set
        if (!req.user || !req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        const currentPlayerId = req.user.id;

        // Find games with status 'pending' that do not already have the current player
        const availableGames = await Game.find({
            status: 'pending',
            players: { $not: { $size: 2 } }
        }).populate('players.userId', 'firstname lastname');

        console.log('Current Player ID:', currentPlayerId);
        console.log('Available Games:', availableGames);
        console.log('Available Games Length:', availableGames.length);


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

// Controller function to delete the game when a user logs out
export const revokeGame = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;

        // Find the game that the user is part of and delete it
        const deletedGame = await Game.findOneAndDelete({
            'players.userId': currentPlayerId,
            status: { $in: ['pending', 'ongoing'] },
        });

        if (!deletedGame) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Game deleted successfully',
            deletedGame,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
