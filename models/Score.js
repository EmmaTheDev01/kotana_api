import mongoose from "mongoose";
const scoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    }
},
    { timestamps: true }
);

export default mongoose.model("Score", scoreSchema)