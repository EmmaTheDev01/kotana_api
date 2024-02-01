import Score from '../models/Score.js'

export const createScore = async (req, res) => {
    try {
        const newScore = new Score(req.body);
        await newScore.save();
        res.status(200).json({
            success: true,
            message: "Successfully created Score",
            data: newScore
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create Score'
        });
    }
}
export const updateScore = async (req, res) => {
    const ScoreId = req.params.id;
    try {
        const updatedScore = await Score.findByIdAndUpdate(ScoreId, { $set: req.body }, { new: true });
        res.status(200).json({
            success: true,
            message: "Successfully updated Score",
            data: updatedScore
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update Score'
        });
    }
};

export const findAllScores = async (req, res) => {
    const allScores = await Score.find({});
    
    if (allScores.length > 0) {
        res.status(200).json({
            success: true,
            message: 'All Scores available',
            data: allScores
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'No Scores available'
        });
    }
};
