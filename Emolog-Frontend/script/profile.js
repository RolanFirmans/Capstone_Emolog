const token = localStorage.getItem("token");

if (!token) {
  alert("Token tidak ditemukan, silakan login kembali.");
  window.location.href = "/pages/login/";
}

fetch("https://emologcapstone-production.up.railway.app/api/profile", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Gagal mengambil profil.");
    }

    // Isi form input dengan data user
    document.getElementById("email").value = data.email || "";
    document.getElementById("username").value = data.username || "";

    // Optional: tampilkan nama di <h1> misalnya
    const nameHeader = document.querySelector(".profile-info h1");
    if (nameHeader) {
      nameHeader.textContent = data.fullname || data.username;
    }
  })
  .catch(err => {
    alert("Terjadi kesalahan saat mengambil data profil: " + err.message);
    console.error(err);

    if (err.message.includes("jwt")) {
      localStorage.clear();
      window.location.href = "/pages/login/";
    }
  });

// Tombol Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const konfirmasi = confirm("Yakin ingin logout?");
    if (konfirmasi) {
      localStorage.clear();
      alert("Kamu telah logout.");
      window.location.href = "/pages/login/";
    }
  });
}

document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const targetId = toggle.dataset.target;
    const input = document.getElementById(targetId);
    const icon = toggle.querySelector('img');

    if (!input || !icon) return;

    const isPassword = input.type === 'password';

    input.type = isPassword ? 'text' : 'password';
    icon.src = isPassword ? ".../assets/eyeopen.png" : ".../assets/eyeclose.png";
    icon.alt = isPassword ? "Hide Password" : "Show Password";
  });
});




// === MODAL CHANGE EMAIL ===
const changeEmailBtn = document.getElementById("changeEmailBtn");
const changeEmailModal = document.getElementById("changeEmailModal");
const closeEmailModalBtn = document.getElementById("closeEmailModalBtn");
const cancelEmailBtn = document.getElementById("cancelEmailBtn");

if (changeEmailBtn && changeEmailModal) {
  changeEmailBtn.addEventListener("click", () => {
    changeEmailModal.style.display = "block";
  });
}

if (closeEmailModalBtn) {
  closeEmailModalBtn.addEventListener("click", () => {
    changeEmailModal.style.display = "none";
  });
}

if (cancelEmailBtn) {
  cancelEmailBtn.addEventListener("click", () => {
    changeEmailModal.style.display = "none";
  });
}

const saveEmailBtn = document.getElementById("saveEmailBtn");

if (saveEmailBtn) {
  saveEmailBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    const currentEmail = document.getElementById("currentEmail").value.trim();
    const newEmail = document.getElementById("newEmail").value.trim();
    const confirmNewEmail = document.getElementById("confirmNewEmail").value.trim();

    if (!currentEmail || !newEmail || !confirmNewEmail) {
      alert("Semua kolom harus diisi.");
      return;
    }

    if (newEmail !== confirmNewEmail) {
      alert("Email baru dan konfirmasi tidak cocok.");
      return;
    }

    try {
      const response = await fetch("https://emologcapstone-production.up.railway.app/api/profile/email", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentEmail, newEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal update email.");
      }

      alert("Email berhasil diperbarui. Silakan login kembali.");
      localStorage.clear();
      window.location.href = "/pages/login/";
    } catch (err) {
      alert("Error saat update email: " + err.message);
      console.error(err);
    }
  });
}


// === MODAL CHANGE PASSWORD ===
const changePasswordBtn = document.getElementById("changePasswordBtn");
const changePasswordModal = document.getElementById("changePasswordModal");
const closePasswordModalBtn = document.getElementById("closeModalBtn");
const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");

if (changePasswordBtn && changePasswordModal) {
  changePasswordBtn.addEventListener("click", () => {
    changePasswordModal.style.display = "block";
  });
}

if (closePasswordModalBtn) {
  closePasswordModalBtn.addEventListener("click", () => {
    changePasswordModal.style.display = "none";
  });
}

if (cancelPasswordBtn) {
  cancelPasswordBtn.addEventListener("click", () => {
    changePasswordModal.style.display = "none";
  });
}

document.getElementById("savePasswordBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Harap isi semua field password.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Password baru dan konfirmasi tidak cocok.");
    return;
  }

  try {
    const res = await fetch("https://emologcapstone-production.up.railway.app/api/profile/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengubah password.");

    alert("Password berhasil diubah!");
    document.getElementById("changePasswordModal").style.display = "none";
  } catch (err) {
    alert("Error saat update password: " + err.message);
    console.error(err);
  }
});


// Optional: Klik di luar modal untuk menutup
window.addEventListener("click", (event) => {
  if (event.target === changeEmailModal) {
    changeEmailModal.style.display = "none";
  }
  if (event.target === changePasswordModal) {
    changePasswordModal.style.display = "none";
  }
});

