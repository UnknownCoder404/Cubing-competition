import { url } from "../Scripts/variables.js";
import { addToken } from "../Scripts/credentials.js";
const createCompDateInput = document.querySelector(".comp-date");
function getEvents(competition) {
  return competition.events;
}
async function getCompetitions() {
  const response = await fetch(`${url}/competitions/get`);
  const data = await response.json();

  return data;
}
async function createCompetitionHtml(competition) {
  const events = getEvents(competition);
  const eventsHtml = events
    .map((event) => `<li class="event">${event.name}</li>`)
    .join("\n");
  const html = `<div class="competition">
    <h2>${competition.name}</h2>
    <p>Datum: ${new Date(competition.date).toLocaleDateString()}</p>
    <h2>Eventovi</h2>
    <ul class="events-list">
    ${eventsHtml}
    </ul>
    <button class="edit-button ${competition._id}-edit-button">Uredi</button>
    <button class="delete-button ${
      competition._id
    }-delete-button">Obriši</button>
  </div>`;
  return html;
}
async function logCompetitions() {
  const competitions = await getCompetitions();
  competitions.forEach(async (competition) => {
    const competitionHtml = await createCompetitionHtml(competition);
    document
      .querySelector(".competitions")
      .insertAdjacentHTML("beforeend", competitionHtml);
    const editButton = document.querySelector(`.competition-${competition._id}-edit-button`);
    const deleteButton = document.querySelector(`.competition-${competition._id}-delete-button`);
    
  });
  console.log(competitions);
}
async function createCompetition(name, date, events) {
  if (typeof name !== "string" || typeof date !== "string") {
    return;
  }
  const response = await fetch(`${url}/competitions/create`, {
    method: "POST",
    headers: addToken({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      name,
      date,
      events,
    }),
  });
  console.log(response);
  const data = await response.json();
  return data;
}
async function main() {
  await logCompetitions();
  // await createCompetition("Test",new Date(createCompDateInput.value).toISOString(),[]);
}
main();
console.log(new Date(createCompDateInput.value));
