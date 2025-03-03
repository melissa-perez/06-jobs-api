import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { handleDelete } from "./delete.js";

let matchesDiv = null;
let matchesTable = null;
let matchesTableHeader = null;

export const handleMatches = () => {
    matchesDiv = document.getElementById("matches");
    const logoff = document.getElementById("logoff");
    const addMatch = document.getElementById("add-match");
    matchesTable = document.getElementById("matches-table");
    matchesTableHeader = document.getElementById("matches-table-header");

    matchesDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addMatch) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);

                message.textContent = "You have been logged off.";

                matchesTable.replaceChildren([matchesTableHeader]);

                showLoginRegister();
            }
            else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            }
            else if (e.target.classList.contains("deleteButton")) {
                message.textContent = "";
                handleDelete(e.target.dataset.id);
            }
        }
    });
};

export const showMatches = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/matches", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [matchesTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                matchesTable.replaceChildren(...children); // clear this for safety
            } else {
                for (let i = 0; i < data.matches.length; i++) {
                    let rowEntry = document.createElement("tr");

                    let editButton = `<td><button type="button" class="editButton" data-id=${data.matches[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.matches[i]._id}>delete</button></td>`;
                    let rowHTML = `
              <td>${data.matches[i].map}</td>
              <td>${data.matches[i].finalScore}</td>
              <td>${data.matches[i].outcome}</td>
              <td>${data.matches[i].gameMode}</td>
<td>
    ${data.matches[i].date
                            ? (function () {
                                const date = new Date(data.matches[i].date);

                                const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                                const utcDay = date.getUTCDate().toString().padStart(2, '0');
                                const utcYear = date.getUTCFullYear().toString().slice(-2);

                                return `${utcMonth}/${utcDay}/${utcYear}`;
                            })()
                            : "N/A"
                        } - 
    ${data.matches[i].startTime ? data.matches[i].startTime : "N/A"}
</td>




              <div>${editButton}${deleteButton}</div>`;
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                matchesTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(matchesDiv);
};
