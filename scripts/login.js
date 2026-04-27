const correctName = "Klimentiy";
const correctPassword = "milkentiY!88";

const loginForm = document.getElementById("loginForm");
const loginName = document.getElementById("loginName");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = loginName.value.trim();
  const password = loginPassword.value;

  if (name === correctName && password === correctPassword) {
    localStorage.setItem("mogamedLoggedIn", "yes");
    window.location.href = "../index.html";
  } else {
    loginError.textContent = "Wrong name or password.";
  }
});
