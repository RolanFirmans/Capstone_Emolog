// Menangani tombol "Change Password"
const changePasswordBtn = document.getElementById("changePasswordBtn");
const changeEmailBtn = document.getElementById("changeEmailBtn");
const modalPassword = document.getElementById("changePasswordModal");
const modalEmail = document.getElementById("changeEmailModal");
const closePasswordModalBtn = document.getElementById("closeModalBtn");
const closeEmailModalBtn = document.getElementById("closeEmailModalBtn");

// Menangani tombol "Save" dan "Cancel" untuk Change Email
const saveEmailBtn = document.getElementById("saveEmailBtn");
const cancelEmailBtn = document.getElementById("cancelEmailBtn");

// Menangani tombol "Save" dan "Cancel" untuk Change Password
const savePasswordBtn = document.getElementById("savePasswordBtn");
const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");

// Menampilkan modal saat tombol Change Password diklik
changePasswordBtn.onclick = function() {
  modalPassword.style.display = "flex";
}

// Menampilkan modal saat tombol Change Email diklik
changeEmailBtn.onclick = function() {
  modalEmail.style.display = "flex";
}

// Menutup modal saat tombol tutup diklik untuk Change Password
closePasswordModalBtn.onclick = function() {
  modalPassword.style.display = "none";
}

// Menutup modal saat tombol tutup diklik untuk Change Email
closeEmailModalBtn.onclick = function() {
  modalEmail.style.display = "none";
}

// Menutup modal jika pengguna mengklik di luar modal untuk Change Password
window.onclick = function(event) {
  if (event.target === modalPassword) {
    modalPassword.style.display = "none";
  }
  if (event.target === modalEmail) {
    modalEmail.style.display = "none";
  }
}

// Menangani klik tombol Save untuk Change Email
saveEmailBtn.onclick = function() {
  // Add logic to save the new email here
  alert("Email successfully changed!");
  modalEmail.style.display = "none";
}

// Menangani klik tombol Cancel untuk Change Email
cancelEmailBtn.onclick = function() {
  modalEmail.style.display = "none";
}

// Menangani klik tombol Save untuk Change Password
savePasswordBtn.onclick = function() {
  // Add logic to save the new password here
  alert("Password successfully changed!");
  modalPassword.style.display = "none";
}

// Menangani klik tombol Cancel untuk Change Password
cancelPasswordBtn.onclick = function() {
  modalPassword.style.display = "none";
}

// Menangani toggle password visibility
function togglePassword(inputId) {
  const passwordField = document.getElementById(inputId);  // Menangkap input dengan ID yang sesuai
  const eyeIcon = document.getElementById(`eye-icon-${inputId}`);  // Menangkap gambar ikon dengan ID yang sesuai

  // Jika password disembunyikan, tampilkan password
  if (passwordField.type === "password") {
    passwordField.type = "text";  // Mengubah tipe input menjadi 'text' agar password terlihat
    eyeIcon.src = "/assets/eyeopen.png";  // Mengubah ikon menjadi mata terbuka
  } else {
    passwordField.type = "password";  // Mengubah tipe input kembali menjadi 'password' untuk menyembunyikan password
    eyeIcon.src = "/assets/eyeclose.png";  // Mengubah ikon menjadi mata tertutup
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const forgotLink = document.getElementById('forgotPasswordLink');
  const modal = document.getElementById('forgotPasswordModal');
  const closeModal = document.getElementById('closeModal');

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
