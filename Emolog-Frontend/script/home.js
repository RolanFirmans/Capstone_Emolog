const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

// Redirect ke login jika tidak ada token/username
if (!username || !token) {
  window.location.href = "/pages/login/";
}

// Ganti greeting dengan username
const greetingElement = document.querySelector(".greeting-text h1");
if (greetingElement) {
  greetingElement.textContent = `Halo, ${username}!`;
}

// Tombol "Mulai Menulis"
const startBtn = document.querySelector(".start-journaling-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "/pages/journaling/";
  });
}

// Initialize current week
currentWeekStart = getStartOfWeek(new Date());
updateWeekRangeDisplay(currentWeekStart);

// Ambil entri terbaru dan entri minggu ini
fetchLatestDiary(token);
fetchWeeklyEntries(token, currentWeekStart);

// Setup event listeners untuk navigasi minggu
setupWeekNavigation(token);

// Global variable untuk tracking minggu saat ini
let currentWeekStart = null;

// Function untuk mendapatkan awal minggu (Senin)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Senin sebagai hari pertama
  d.setDate(diff);
  d.setHours(0, 0, 0, 0); // Set ke awal hari
  return d;
}

// Function untuk setup navigasi minggu
function setupWeekNavigation(token) {
  const prevBtn = document.getElementById("prev-week");
  const nextBtn = document.getElementById("next-week");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() - 7);
      updateWeekRangeDisplay(currentWeekStart);
      fetchWeeklyEntries(token, currentWeekStart);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      updateWeekRangeDisplay(currentWeekStart);
      fetchWeeklyEntries(token, currentWeekStart);
    });
  }
}

// Function untuk update tampilan range tanggal
function updateWeekRangeDisplay(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const formattedRange = `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
  const dateRangeElement = document.querySelector(".date-range");
  if (dateRangeElement) {
    dateRangeElement.textContent = formattedRange;
  }
}

// Function untuk format tanggal pendek
function formatShortDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    console.warn("⛔ formatShortDate menerima date tidak valid:", date);
    return "Tanggal tidak valid";
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
  }).format(date);
}

// Function untuk mendapatkan emoji berdasarkan emotion_id
function getEmojiByEmotion(emotionId) {
  const emojiMap = {
    0: "😊", // Senang
    1: "😐", // Netral
    2: "😢"  // Sedih

  };
  return emojiMap[emotionId] || "📌";
}

// Function untuk fetch diary terakhir
async function fetchLatestDiary(token) {
  try {
    const response = await fetch("https://emologcapstone-production.up.railway.app/api/entries", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.warn("Gagal mengambil data diary");
      return;
    }

    const entries = await response.json();

    // Sort entries berdasarkan created_at DESC
    const sortedEntries = entries.sort((a, b) => {
      const timeA = new Date(a.created_at || a.entry_date || 0);
      const timeB = new Date(b.created_at || b.entry_date || 0);
      return timeB - timeA;
    });

    const latestEntry = sortedEntries[0];

    // Isi teks diary
    const diaryTextElement = document.querySelector(".diary-text");
    if (diaryTextElement) {
      if (latestEntry) {
        diaryTextElement.textContent = latestEntry.entry_text;
      } else {
        diaryTextElement.textContent = "Belum ada catatan.";
      }
    }

    // Tampilkan emoji berdasarkan emotion_id
    const emojiElement = document.querySelector(".emoji");
    if (emojiElement && latestEntry?.emotion_id !== undefined) {
      emojiElement.textContent = getEmojiByEmotion(latestEntry.emotion_id);
    }

    // Tanggal diary terakhir
    const diaryDate = document.querySelector(".diary-date");
    if (diaryDate && latestEntry) {
      const rawDate = latestEntry.created_at || latestEntry.entry_date;
      if (rawDate) {
        const date = new Date(rawDate);
        const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        const hariName = hari[date.getDay()];
        const tanggal = String(date.getDate()).padStart(2, "0");
        diaryDate.textContent = `${tanggal} ${hariName}`;
      } else {
        diaryDate.textContent = "";
      }
    }

    if (latestEntry?.emotion_id !== undefined) {
      const suggestRes = await fetch("https://emologcapstone-production.up.railway.app/api/emotion/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emotion_id: latestEntry.emotion_id })
      });

      const suggestData = await suggestRes.json();

      // Tampilkan suggestion (quote)
      const quoteElement = document.getElementById("quote-box");
      if (quoteElement && suggestRes.ok) {
        quoteElement.textContent = suggestData.suggestion;
      }
    }

  } catch (error) {
    console.error("Gagal fetch diary:", error.message);
  }
}

async function fetchQuoteSuggestion(emotion_id) {
  try {
    const response = await fetch("https://emologcapstone-production.up.railway.app/api/emotion/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ emotion_id })
    });

    const data = await response.json();

    if (response.ok) {
      // Menampilkan hanya bagian quotes / suggestion
      const quote = data.suggestion;
      document.getElementById("quote-box").innerText = quote;
    } else {
      console.error("Gagal memuat saran:", data.message);
    }

  } catch (error) {
    console.error("Error fetchQuoteSuggestion:", error.message);
  }
}

// Function untuk fetch entries dalam range mingguan
async function fetchWeeklyEntries(token, startDate) {
  try {
    const start = startDate.toISOString().split("T")[0];
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    const end = endDate.toISOString().split("T")[0];

    console.log(`📅 Fetching entries from ${start} to ${end}`);

    // Cek apakah endpoint /range ada, jika tidak gunakan endpoint biasa
    let response;
    let data = [];

    try {
      // Coba endpoint range dulu
      response = await fetch(`https://emologcapstone-production.up.railway.app/api/entries/range?start=${start}&end=${end}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        data = await response.json();
        console.log("✅ Data dari endpoint /range:", data);
      } else {
        throw new Error(`Range endpoint error: ${response.status}`);
      }
    } catch (rangeError) {
      console.warn("⚠️ Endpoint /range tidak tersedia, mencoba endpoint utama:", rangeError.message);

      // Fallback ke endpoint utama dan filter di frontend
      response = await fetch("https://emologcapstone-production.up.railway.app/api/entries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Main endpoint error: ${response.status}`);
      }

      const allEntries = await response.json();
      console.log("📦 Semua entries dari backend:", allEntries);

      // Filter entries berdasarkan range tanggal
      data = allEntries.filter(entry => {
        const entryDate = new Date(entry.entry_date || entry.created_at);
        const entryDateString = entryDate.toISOString().split("T")[0];
        return entryDateString >= start && entryDateString <= end;
      });

      console.log(`🔍 Entries yang difilter untuk ${start} - ${end}:`, data);
    }

    renderWeeklyRecap(data, startDate);
  } catch (err) {
    console.error("❌ Error saat fetchWeeklyEntries:", err);
    // Tampilkan recap kosong daripada error message
    renderWeeklyRecap([], startDate);
  }
}

// Function untuk render recap mingguan
function renderWeeklyRecap(entries, weekStartDate) {
  const listContainer = document.querySelector(".recap-week-list");
  if (!listContainer) {
    console.warn("❌ Element .recap-week-list tidak ditemukan");
    return;
  }

  console.log("🎨 Rendering weekly recap dengan", entries.length, "entries");
  listContainer.innerHTML = ""; // kosongkan dulu

  // Buat array untuk 7 hari dalam seminggu
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStartDate);
    currentDate.setDate(weekStartDate.getDate() + i);
    weekDays.push(currentDate);
  }

  console.log("📅 Week days yang akan dirender:", weekDays.map(d => d.toISOString().split("T")[0]));

  // Render setiap hari dalam seminggu
  weekDays.forEach((date, index) => {
    const dateString = date.toISOString().split("T")[0];

    // Cari entry untuk tanggal ini
    const dayEntries = entries.filter(entry => {
      const entryDate = new Date(entry.entry_date || entry.created_at);
      const entryDateString = entryDate.toISOString().split("T")[0];
      return entryDateString === dateString;
    });

    let dayEntry = null;

    if (dayEntries.length > 0) {
      // Urutkan dan ambil yang paling baru
      dayEntries.sort((a, b) => new Date(b.created_at || b.entry_date) - new Date(a.created_at || a.entry_date));
      dayEntry = dayEntries[0];
    }

    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(date);

    const item = document.createElement("div");
    item.classList.add("recap-item");

    if (dayEntry) {
      // Ada entry untuk hari ini
      const emojiSrc = getEmojiByEmotion(dayEntry.emotion_id);
      console.log(`✅ Entry ditemukan untuk ${dateString}:`, dayEntry.entry_text.substring(0, 50) + "...");

      item.innerHTML = `
        <div class="emoji-container">
          <div class="emoji" style="font-size: 2rem;">📌</div>
        </div>
        <div class="recap-text">
          <div class="recap-date">${formattedDate}</div>
          <div class="recap-desc">${dayEntry.entry_text}</div>
        </div>
      `;
    } else {
      // Tidak ada entry untuk hari ini
      console.log(`⭕ Tidak ada entry untuk ${dateString}`);
      item.innerHTML = `
        <div class="emoji-container">
          <div class="emoji" style="font-size: 2rem;">📌</div>
        </div>
        <div class="recap-text">
          <div class="recap-date">${formattedDate}</div>
          <div class="recap-desc" style="color: #888; font-style: italic;">Tidak ada catatan</div>
        </div>
      `;
      item.style.opacity = "0.6";
    }

    listContainer.appendChild(item);
  });

  console.log(`🎯 Selesai render ${weekDays.length} hari, ${entries.length} entries ditemukan`);
}
