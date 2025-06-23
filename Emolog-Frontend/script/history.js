/* ---------- ELEMENTS ---------- */
const calendarGrid = document.querySelector(".calendar-grid");
const prevBtn = document.querySelector(".calendar-nav button:first-child");
const nextBtn = document.querySelector(".calendar-nav button:last-child");
const calendarTitle = document.querySelector(".calendar-title");

const journalDateDisplay = document.querySelector(".journal-header h3");
const diaryContainer = document.querySelector(".diary-content");
const moodEmoji = document.querySelector(".mood-emoji");

const token = localStorage.getItem("token");
let allEntries = [];

/* ---------- STATE ---------- */
let currentDate = new Date();             // tanggal hari ini
let currentMonth = currentDate.getMonth(); // 0-11
let currentYear = currentDate.getFullYear();

/* ---------- TOOLS ---------- */
const emojiMap =
{
  0: "😊",
  1: "😐",
  2: "😢"
};
const getEmojiByEmotion = id => emojiMap[id] || "😐";

const getModeEmotion = entries => {
  if (!entries.length) return null;
  const freq = {};
  entries.forEach(e => { freq[e.emotion_id] = (freq[e.emotion_id] || 0) + 1; });
  return parseInt(Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b));
};

/* ---------- API ---------- */
async function fetchEntries() {
  try {
    const res = await fetch("https://emologcapstone-production.up.railway.app/api/entries", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Gagal mengambil data journaling");
    allEntries = await res.json();
  } catch (err) {
    console.error(err.message);
  }
}

async function deleteEntry(id) {
  try {
    const res = await fetch(`https://emologcapstone-production.up.railway.app/api/entries/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Gagal menghapus entry");
    allEntries = allEntries.filter(e => e.id !== id);
    showEntryByDate(selectedDate);
  } catch (err) { alert(err.message); }
}

/* ---------- CALENDAR RENDER ---------- */
function renderCalendar() {
  // Header
  const monthName = new Date(currentYear, currentMonth).toLocaleString("id-ID", { month: "long" });
  calendarTitle.textContent = `${monthName}, ${currentYear}`;

  // Kosongkan grid, tapi biarkan 7 header hari pertama (M T W T F S S)
  [...calendarGrid.querySelectorAll(".calendar-day, .other-month")].forEach(el => el.remove());

  // Hitung hari
  const firstDayIdx = new Date(currentYear, currentMonth, 1).getDay() || 7; // Senin = 1 … Minggu = 7
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysPrev = firstDayIdx - 1; // butuh berapa filler di depan

  // Tampilkan sisa hari bulan sebelumnya (optional filler)
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = daysPrev; i > 0; i--) {
    calendarGrid.insertAdjacentHTML("beforeend",
      `<button class="calendar-day other-month">${daysInPrevMonth - i + 1}</button>`);
  }

  // Hari di bulan ini
  for (let d = 1; d <= daysInMonth; d++) {
    const btnClass = (d === currentDate.getDate() &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear())
      ? "calendar-day current-month selected"
      : "calendar-day current-month";
    calendarGrid.insertAdjacentHTML("beforeend",
      `<button class="${btnClass}">${d}</button>`);
  }

  // Isi belakang agar grid penuh 42 sel
  const totalBtns = daysPrev + daysInMonth;
  const filler = 42 - totalBtns;
  for (let i = 1; i <= filler; i++) {
    calendarGrid.insertAdjacentHTML("beforeend",
      `<button class="calendar-day other-month">${i}</button>`);
  }

  attachDayEvents(); // event-listener utk button baru
}

/* ---------- ENTRY DISPLAY ---------- */
let selectedDate = new Date(); // default hari ini

function showEntryByDate(date) {
  selectedDate = date;
  const yyyy_mm_dd = date.toISOString().split("T")[0];

  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  journalDateDisplay.textContent = date.toLocaleDateString('id-ID', options);

  const entries = allEntries.filter(e =>
    new Date(e.entry_date).toISOString().split("T")[0] === yyyy_mm_dd
  );

  diaryContainer.innerHTML = "";

  if (entries.length) {
    const modeEmotion = getModeEmotion(entries);
    moodEmoji.textContent = getEmojiByEmotion(modeEmotion);

    entries.forEach(entry => {
      const entryEl = document.createElement("div");
      entryEl.className = "diary-entry-block";
      entryEl.innerHTML = `
          <h4 class="diary-title">${entry.title || "Tanpa Judul"}</h4>
          <p class="diary-text">${entry.entry_text || "(Kosong)"}</p>
          <div class="mood-display">Mood: ${getEmojiByEmotion(entry.emotion_id)}</div>
          <div class="action-buttons">
              <button class="btn-secondary delete-btn" data-id="${entry.id}">Delete</button>
          </div>
          <hr/>
        `;
      diaryContainer.appendChild(entryEl);
    });

    // Pasang event Delete
    diaryContainer.querySelectorAll(".delete-btn").forEach(btn =>
      btn.addEventListener("click", () => deleteEntry(+btn.dataset.id)));

  } else {
    moodEmoji.textContent = "😐";
    diaryContainer.innerHTML = `<p class="diary-text">Belum ada journaling di tanggal ini.</p>`;
  }
}

/* ---------- DAY BUTTON EVENTS ---------- */
function attachDayEvents() {
  calendarGrid.querySelectorAll(".calendar-day").forEach(btn => {
    if (!btn.classList.contains("other-month")) {
      btn.addEventListener("click", () => {
        const dayNum = +btn.textContent;
        if (Number.isNaN(dayNum)) return;

        // Clear & Set highlight
        calendarGrid.querySelectorAll(".calendar-day").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        const date = new Date(currentYear, currentMonth, dayNum);
        showEntryByDate(date);
      });
    }
  });
}

/* ---------- NAV BUTTON EVENTS ---------- */
prevBtn.addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
});

/* ---------- INIT ---------- */
fetchEntries().then(() => {
  renderCalendar();
  showEntryByDate(currentDate);
});
