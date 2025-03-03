const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
    map: {
        type: String,
        required: [true, "Please provide map name."],
        maxlength: 50
    },
    finalScore: {
        type: Number,
        required: [true, "Please provide final score number."],
    },
    outcome: {
        type: String,
        enum: ["Victory", "Defeat", "Draw", "Abandoned"],
        required: true,
        default: "Victory"
    },
    gameMode: {
        type: String,
        enum: ["Escort", "Flashpoint", "Hybrid", "Clash", "Push", "Control"],
        required: true,
        default: "Clash"
    },
    startTime: {
        type: String,
        required: false,
        default: "00:00"
    },
    date: {
        type: Date,
        required: false,
        default: null
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"]
    }
}, { timestamps: true });

module.exports = mongoose.model("Match", MatchSchema);