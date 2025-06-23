const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Email dan password harus diisi.");
    return;
  }

  try {
    const response = await fetch("https://emologcapstone-production.up.railway.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Login gagal: " + (data.message || "Email atau password salah."));
      return;
    }

    const user = data.user; // ✅ Ambil dari data.user

    // Simpan token dan user ke localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("email", user.email);

    // (Opsional) Simpan sebagai satu objek
    localStorage.setItem("user", JSON.stringify(user));

    alert("Login berhasil!");
    window.location.href = "/pages/home";

  } catch (error) {
    console.error("Login error:", error);
    alert("Terjadi kesalahan: " + error.message);
  }
});

// Toggle password visibility
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");

if (passwordInput && toggleIcon) {
  toggleIcon.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleIcon.src = isHidden ? "/assets/eyeopen.png" : "/assets/eyeclose.png";
  });
}
