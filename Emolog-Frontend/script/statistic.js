const token = localStorage.getItem("token");
if (!token) {
  alert("Tidak ada token, silakan login terlebih dahulu.");
  window.location.href = '/pages/login'
}

function getEmojiByEmotion(emotionId) {
  const emojiMap = {
    0: "😊", // Senang
    1: "😐", // Netral
    2: "😢"  // Sedih
  };
  return emojiMap[emotionId] || "-";
}

fetch("https://emologcapstone-production.up.railway.app/api/entries", {
  headers: {
    Authorization: `Bearer ${token}`
  }
}).then(async (res) => {

  if (!res.ok) {
    throw new Error("Gagal mengambil data");
  }

  const entries = await res.json();

  // === STATISTIK DASAR ===
  document.querySelector(".stat-number").textContent = entries.length;

  const moodCount = { 0: 0, 1: 0, 2: 0 };
  entries.forEach(entry => {
    if (entry.emotion_id in moodCount) {
      moodCount[entry.emotion_id]++;
    }
  });

  const total = entries.length || 1;
  const happyPct = Math.round((moodCount[0] / total) * 100);
  const netralPct = Math.round((moodCount[1] / total) * 100);
  const sadPct = Math.round((moodCount[2] / total) * 100);

  document.querySelector(".bar-happy").style.width = happyPct + "%";
  document.querySelector(".bar-happy").textContent = happyPct + "%";

  document.querySelector(".bar-neutral").style.width = netralPct + "%";
  document.querySelector(".bar-neutral").textContent = netralPct + "%";

  document.querySelector(".bar-sad").style.width = sadPct + "%";
  document.querySelector(".bar-sad").textContent = sadPct + "%";

  // === MOOD TERBANYAK MINGGU INI ===
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const weekAgo = new Date();
  weekAgo.setDate(now.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const thisWeekEntries = entries.filter(e => {
    const d = new Date(e.created_at);
    return d >= weekAgo && d <= now;
  });

  const weekMoodCount = { 0: 0, 1: 0, 2: 0 };
  thisWeekEntries.forEach(e => {
    if (e.emotion_id in weekMoodCount) {
      weekMoodCount[e.emotion_id]++;
    }
  });

  const dominantMood = Object.entries(weekMoodCount).reduce((a, b) => b[1] > a[1] ? b : a, [null, 0])[0];
  const moodLabel = dominantMood === "0" ? "Happy!" : dominantMood === "1" ? "Neutral" : "Sad";
  document.querySelector(".stat-item:nth-child(2) .stat-number").textContent = moodLabel;

  // === TREND MINGGUAN ===
  const trendDays = document.querySelectorAll(".trend-day");
  const trendMap = {};

  thisWeekEntries.forEach(entry => {
    const date = new Date(entry.created_at);
    const dayIndex = date.getDay(); // 0 = Minggu, 1 = Senin, ...
    trendMap[dayIndex] = getEmojiByEmotion(entry.emotion_id);
  });

  const dayIndexOrder = [1, 2, 3, 4, 5, 6, 0]; // Senin–Minggu
  trendDays.forEach((dayEl, i) => {
    const emoji = trendMap[dayIndexOrder[i]] || "-";
    const emojiBox = dayEl.querySelector(".trend-emoji");
    emojiBox.innerHTML = `<div class="emoji";">${emoji}</div>`;
  });

}).catch((err) => {
  console.error("❌ Gagal ambil statistik:", err);
})