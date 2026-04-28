console.log("Mogamed Office is running");

const isLoggedIn = localStorage.getItem("mogamedLoggedIn");

if (isLoggedIn !== "yes") {
  const currentPath = window.location.pathname;

  if (!currentPath.includes("login.html")) {
    window.location.href = "pages/login.html";
  }
}
