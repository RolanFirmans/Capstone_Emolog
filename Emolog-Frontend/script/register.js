const form = document.querySelector("form");
const usernameInput = document.getElementById("username"); // pakai id="name" di input
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const toggleIcon = document.querySelector(".toggle-password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!username || !email || !password) {
    alert("Semua field harus diisi.");
    return;
  }

  try {
    const response = await fetch("https://emologcapstone-production.up.railway.app/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password }) // kirim username
    });

    const contentType = response.headers.get("content-type") || "";
    let data = {};

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data.message = text;
    }

    if (!response.ok) {
      alert(data.message || "Registrasi gagal.");
      return;
    }

    if (data.user) {
      const user = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email
      };
      localStorage.setItem("user", JSON.stringify(user));
    }

    alert("Registrasi berhasil! Silakan login.");
    window.location.href = "/pages/login/";

  } catch (error) {
    console.error("Registration error:", error);
    alert("Terjadi kesalahan: " + error.message);
  }
});

// Toggle password visibility
if (toggleIcon && passwordInput) {
  toggleIcon.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleIcon.src = isHidden ? "/assets/eyeopen.png" : "/assets/eyeclose.png";
  });
}