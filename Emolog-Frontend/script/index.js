import '../pages/styles.css'; // Make sure this path is correct based on your bundle output

document.addEventListener("DOMContentLoaded", () => {
  const isSplashScreen = document.getElementById("page-splash-screen");

  // Logic for the Splash Screen page
  if (isSplashScreen) {
    function isLoggedIn() {
      return localStorage.getItem('userToken') !== null;
    }

    setTimeout(() => {
      if (isLoggedIn()) {
        // CORRECT PATH: Point to the /pages/home/ directory
        window.location.href = "/pages/home";
      } else {
        // CORRECT PATH: Point to the /pages/login/ directory
        window.location.href = "/pages/login";
      }
    }, 3000);

  } else {
    // Logic for all other pages
    const headerContainer = document.getElementById("header-container");
    const footerContainer = document.getElementById("footer-container");

    if (headerContainer) {
      // CORRECT PATH: Fetch the actual header.html file
      fetch("/pages/header.html")
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.text();
        })
        .then(data => headerContainer.innerHTML = data)
        .catch(err => console.error("Failed to load header:", err));
    }

    if (footerContainer) {
      // CORRECT PATH: Fetch the actual footer.html file
      fetch("/pages/footer.html")
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.text();
        })
        .then(data => footerContainer.innerHTML = data)
        .catch(err => console.error("Failed to load footer:", err));
    }

    // This router part is already correct! Great job here.
    const path = window.location.pathname;
    if (path.includes("/history")) {
      import("./history.js");
    } else if (path.includes("/home")) {
      import("./home.js");
    } else if (path.includes("/journaling")) {
      import("./journaling.js");
    } else if (path.includes("/login")) {
      import("./login.js");
    } else if (path.includes("/profile")) {
      import("./profile.js");
    } else if (path.includes("/register")) {
      import("./register.js");
    } else if (path.includes("/statistic")) {
      // import("./statistic.js");
    }
  }
});