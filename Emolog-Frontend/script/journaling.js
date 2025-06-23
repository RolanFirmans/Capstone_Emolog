const saveButton = document.querySelector(".save-btn");
const titleInput = document.querySelector(".judul-area");
const entryInput = document.querySelector(".journaling-textarea");
const dateInput = document.getElementById("journal-date");

// Set default tanggal ke hari ini
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Set default tanggal ke hari ini (local timezone)
const today = getLocalDateString();
if (dateInput) dateInput.value = today;

saveButton.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const title = titleInput.value.trim();
  const entry_text = entryInput.value.trim(); // sesuai backend
  const entry_date = dateInput ? dateInput.value : today; // sesuai backend

  if (!title || !entry_text) {
    alert("Judul dan catatan tidak boleh kosong!");
    return;
  }

  try {
    // Step 1: PREDICT MOOD FIRST
    const predictRes = await fetch("https://emologcapstone-production.up.railway.app/api/emotion/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: entry_text })
    });

    if (!predictRes.ok) {
      const errorData = await predictRes.json();
      throw new Error(errorData.message || "Gagal memprediksi mood.");
    }

    const { mood } = await predictRes.json();

    // Step 2: MAP MOOD to emotion_id
    const moodToEmotionId = {
      happy: 0,
      neutral: 1,
      sad: 2
    };
    const emotion_id = moodToEmotionId[mood] || 2; // default to neutral

    // Step 3: SAVE JOURNAL ENTRY
    const response = await fetch("https://emologcapstone-production.up.railway.app/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        entry_text,
        emotion_id,
        entry_date
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menyimpan journaling.");
    }

    alert("Journaling berhasil disimpan!");
    titleInput.value = "";
    entryInput.value = "";

  } catch (error) {
    console.error("Error saat menyimpan journaling:", error.message);
    alert("Gagal: " + error.message);
  }
});