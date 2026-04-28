console.log("Mogamed Office is running");

const isLoggedIn = localStorage.getItem("mogamedLoggedIn");
const currentPath = window.location.pathname;
const isLoginPage = currentPath.includes("login.html");

if (isLoggedIn !== "yes" && !isLoginPage) {
  if (currentPath.includes("/pages/")) {
    window.location.href = "login.html";
  } else {
    window.location.href = "pages/login.html";
  }
}

function logout() {
  localStorage.removeItem("mogamedLoggedIn");
  window.location.href = "pages/login.html";
}
