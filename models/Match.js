const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    map: {
        type: String,
        required: [true, "Please provide map name"],
        maxlength: 50
    },
    finalScore: {
        type: Number,
        required: [true, "Please provide final score number"],
    },
    outcome: {
        type: String,
        enum: ["Victory", "Defeat", "Draw", "Abandoned"],
    },
    gameMode: {
        type: String,
        enum: ["Escort", "Flashpoint", "Hybrid", "Clash", "Push", "Control"],
    },
    gameLength: {
        type: Date,
        required: false
    },
    date: {
        type: Date,
        required: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Match", MatchSchema);