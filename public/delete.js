import { enableInput, message, token } from "./index.js";
import { showJobs } from "./jobs.js";


export const handleDelete = async (jobId) => {
    if (jobId) {
        enableInput(false);
        try {
            const response = await fetch(`/api/v1/jobs/${jobId}`, {
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
                message.textContent = "The jobs entry was not found";
            }
            showJobs();
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showJobs();
        }
        enableInput(true);
    }
};