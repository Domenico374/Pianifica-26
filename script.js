// 🔧 PERSONALIZZA QUI IL NOME DELLA PERSONA
const NOME_DESTINATARIO = "Claudia"; // es. "Claudia", "Martina", "Luca"

// Chiave per il localStorage (così se fai un’altra agenda non si sovrappongono)
const STORAGE_KEY = `agendaEvents_${NOME_DESTINATARIO}_2026`;

let events = [];

// Elementi DOM
const eventForm = document.getElementById("eventForm");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const titleInput = document.getElementById("title");
const descInput = document.getElementById("description");
const eventList = document.getElementById("eventList");
const emptyMessage = document.getElementById("emptyMessage");
const filterDateInput = document.getElementById("filterDate");
const clearFilterBtn = document.getElementById("clearFilter");

const coverSection = document.getElementById("coverSection");
const agendaMain = document.getElementById("agendaMain");
const entraBtn = document.getElementById("entraBtn");
const fraseDelGiornoEl = document.getElementById("fraseDelGiorno");
const nomeDestinatarioSpan = document.getElementById("nomeDestinatario");

// Imposta nome in header
if (nomeDestinatarioSpan) {
  nomeDestinatarioSpan.textContent = NOME_DESTINATARIO;
}

// Frasi del giorno (puoi aggiungerne quante vuoi)
const FRASI = [
  "Ogni giorno è una nuova pagina: riempila di cose che ami.",
  "Fai oggi qualcosa di cui il tuo futuro ti ringrazierà.",
  "Anche un piccolo passo è un passo nella direzione giusta.",
  "Dai tempo ai tuoi sogni: sono il motore dei tuoi giorni.",
  "Non devi fare tutto: basta ciò che conta davvero per te.",
  "La cosa più importante in agenda oggi: prenderti cura di te.",
  "Un giorno alla volta, con gentilezza verso te stessa."
];

function setFraseDelGiorno() {
  const oggi = new Date();
  // Usa il giorno dell’anno per rendere “stabile” la frase nel corso della giornata
  const inizioAnno = new Date(oggi.getFullYear(), 0, 0);
  const diff = oggi - inizioAnno;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % FRASI.length;
  fraseDelGiornoEl.textContent = FRASI[index];
}

// Mostra agenda quando clicchi “Entra nella tua agenda”
entraBtn.addEventListener("click", () => {
  coverSection.style.display = "none";
  agendaMain.classList.remove("hidden");
});

// Carica eventi dal localStorage
function loadEvents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    events = JSON.parse(saved);
  } else {
    events = [];
  }
}

// Salva eventi
function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Formatta data (aaaa-mm-gg → gg/mm/aaaa)
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

// Render lista eventi
function renderEvents(filterDate = "") {
  eventList.innerHTML = "";

  let visibleEvents = events;

  if (filterDate) {
    visibleEvents = events.filter(e => e.date === filterDate);
  }

  if (visibleEvents.length === 0) {
    emptyMessage.style.display = "block";
    return;
  } else {
    emptyMessage.style.display = "none";
  }

  // Ordina per data + ora
  visibleEvents.sort((a, b) => {
    const aDateTime = a.date + " " + a.time;
    const bDateTime = b.date + " " + b.time;
    return aDateTime.localeCompare(bDateTime);
  });

  visibleEvents.forEach(event => {
    const li = document.createElement("li");
    li.className = "event-item";

    const mainDiv = document.createElement("div");
    mainDiv.className = "event-main";

    const titleEl = document.createElement("div");
    titleEl.className = "event-title";
    titleEl.textContent = event.title;

    const metaEl = document.createElement("div");
    metaEl.className = "event-meta";
    metaEl.textContent = `${formatDate(event.date)} • ${event.time}`;

    mainDiv.appendChild(titleEl);
    mainDiv.appendChild(metaEl);

    if (event.description && event.description.trim() !== "") {
      const descEl = document.createElement("div");
      descEl.className = "event-desc";
      descEl.textContent = event.description;
      mainDiv.appendChild(descEl);
    }

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "event-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Elimina";
    deleteBtn.addEventListener("click", () => {
      deleteEvent(event.id);
    });

    actionsDiv.appendChild(deleteBtn);

    li.appendChild(mainDiv);
    li.appendChild(actionsDiv);

    eventList.appendChild(li);
  });
}

// Aggiungi evento
eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const date = dateInput.value;
  const time = timeInput.value;
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!date || !time || !title) {
    alert("Per favore inserisci almeno data, ora e titolo.");
    return;
  }

  const newEvent = {
    id: Date.now(),
    date,
    time,
    title,
    description
  };

  events.push(newEvent);
  saveEvents();
  renderEvents(filterDateInput.value);

  eventForm.reset();
});

// Elimina evento
function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  saveEvents();
  renderEvents(filterDateInput.value);
}

// Filtro per data
filterDateInput.addEventListener("change", () => {
  renderEvents(filterDateInput.value);
});

clearFilterBtn.addEventListener("click", () => {
  filterDateInput.value = "";
  renderEvents();
});

// INIT
loadEvents();
renderEvents();
setFraseDelGiorno();
