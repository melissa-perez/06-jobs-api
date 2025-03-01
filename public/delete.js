import { enableInput, message, token } from "./index.js";
import { showMatches } from "./matches.js";


export const handleDelete = async (matchId) => {
    if (matchId) {
        enableInput(false);
        try {
            const response = await fetch(`/api/v1/matches/${matchId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                message.textContent = data.msg;
            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The match entry was not found";
            }
            showMatches();
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showMatches();
        }
        enableInput(true);
    }
};