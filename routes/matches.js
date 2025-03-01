const express = require("express");

const router = express.Router();

const { getAllMatches, getMatch, createMatch, updateMatch, deleteMatch } = require("../controllers/matches");

router.route("/").post(createMatch).get(getAllMatches);
router.route("/:id").get(getMatch).delete(deleteMatch).patch(updateMatch);

module.exports = router;