const { StatusCodes } = require("http-status-codes");
const Match = require("../models/Match");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllMatches = async (req, res) => {
    const matches = await Match.find({ createdBy: req.user.userId }).sort("createdAt");
    return res.status(StatusCodes.OK).json({ matches, count: matches.length });
};

const getMatch = async (req, res) => {
    const { user: { userId }, params: { id: matchId } } = req;
    const match = await Match.findOne({
        _id: matchId, createdBy: userId
    });
    if (!match) {
        throw new NotFoundError(`No match with id ${matchId}`);
    }
    return res.status(StatusCodes.OK).json({ match });
};

const createMatch = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const match = await Match.create(req.body);
    return res.status(StatusCodes.CREATED).json(match);
};

const updateMatch = async (req, res) => {
    // FIX CODE BETWEEN-----------
    const {
        body: { company, position },
        user: { userId },
        params: { id: matchId }
    } = req;

    console.log(company, position);
    if (company === "" || position === "") {
        throw new BadRequestError("Company or position fields cannot be empty");
    }
    // -------------------
    const match = await Match.findByIdAndUpdate({ _id: matchId, createdBy: userId }, req.body, { new: true, runValidators: true });
    if (!match) {
        throw new NotFoundError(`No match with id: ${matchId}`);
    }
    return res.status(StatusCodes.OK).json({ match });
};

const deleteMatch = async (req, res) => {
    const {
        user: { userId },
        params: { id: matchId }
    } = req;

    const match = await Match.findByIdAndDelete({
        _id: jobId,
        createdBy: userId
    });

    if (!match) {
        throw new NotFoundError(`No match with id ${matchId}`);
    }
    //return res.status(StatusCodes.OK).send({ job });
    return res.status(StatusCodes.OK).json({ msg: "The match was deleted." });
};


module.exports = {
    getAllMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch
};