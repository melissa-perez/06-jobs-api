import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showMatches } from "./matches.js";

let addEditDiv = null;
let map = null;
let score = null;
let outcome = null;
let mode = null;
let time = null;
let played = null;
let addingMatch = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-match");
    map = document.getElementById("map");
    score = document.getElementById("score");
    outcome = document.getElementById("outcome");
    mode = document.getElementById("mode");
    time = document.getElementById("time");
    played = document.getElementById("played");
    addingMatch = document.getElementById("adding-match");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingMatch) {
                enableInput(false);

                let method = "POST";
                let url = "/api/v1/matches";

                if (addingMatch.textContent === "update") {
                    method = "PATCH";
                    url = `/api/v1/matches/${addEditDiv.dataset.id}`;
                }


                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            map: map.value,
                            finalScore: score.value,
                            outcome: outcome.value,
                            gameMode: mode.value,
                            date: played.value ? new Date(played.value).toISOString() : null,
                            startTime: time.value
                        }),
                    });

                    const data = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        if (response.status === 200) {
                            // a 200 is expected for a successful update
                            message.textContent = "The match entry was updated.";
                        } else {
                            // a 201 is expected for a successful create
                            message.textContent = "The match entry was created.";
                        }

                        map.value = "";
                        score.value = "";
                        outcome.value = "";
                        mode.value = "";
                        time.value = "";
                        played.value = "";
                        showMatches();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.log(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);
            }
            else if (e.target === editCancel) {
                message.textContent = "";
                showMatches();
            }
        }
    });
};

export const showAddEdit = async (matchId) => {
    if (!matchId) {
        map.value = "";
        score.value = "";
        outcome.value = "";
        mode.value = "";
        time.value = "";
        played.value = "";

        addingMatch.textContent = "add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/api/v1/matches/${matchId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 200) {
                map.value = data.match.map;
                score.value = data.match.finalScore;
                outcome.value = data.match.outcome;
                mode.value = data.match.gameMode;
                time.value = data.match.startTime;
                played.value = data.match.date ? data.match.date.split("T")[0] : "";
                addingMatch.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = matchId;

                setDiv(addEditDiv);
            } else {
                // Handle case where match was not found
                message.textContent = "The match entry was not found";
                showMatches();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showMatches();
        }
        enableInput(true);
    }
};
