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

        // Generate a random code for the game
        const code = generateRandomCode();

        // Create a new game with the logged-in player as player one and the generated code
        const newGame = await Game.create({ players: [currentPlayerId], code: code });

        res.status(201).json({
            success: true,
            message: 'Game created successfully',
            gameId: newGame._id,
            code,
        });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create game',
        });
    }
};


// Controller function to join an existing game with a code
export const joinGameWithCode = async (req, res) => {
    try {
        const currentPlayerId = req.user.id;
        const { code } = req.body;

        // Find the game by code
        const game = await Game.findOne({ code: code });

        if (!game) {
            return res.status(404).json({
                success: false,
                message: 'Game not found',
            });
        }

        // Check if the current player is already in the game
        if (game.players.includes(currentPlayerId)) {
            return res.status(400).json({
                success: false,
                message: 'You are already in the game',
            });
        }

        // Add the current player to the game as player 2
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
            players: { $ne: currentPlayerId },
        });

        console.log('Current Player ID:', currentPlayerId);
        console.log('Available Games:', availableGames);

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
            players: currentPlayerId,
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
