import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {

        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    score: {
        type: Number,
        default: 0
    },
    online: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
