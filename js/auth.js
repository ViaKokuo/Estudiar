/* ==========================================================
   Estudiar - authentication (simulated, no database)
   - A hardcoded demo account always works.
   - New accounts from the Sign up tab are saved in localStorage.
   - The logged-in user is kept in sessionStorage.
   Other pages can call requireAuth(), getCurrentUser(), logout().
   ========================================================== */

const DEMO_USER = { name: "Hisham", username: "hisham", password: "estudiar123" };
const USERS_KEY = "estudiar_users";
const SESSION_KEY = "estudiar_session";
const HOME_PAGE = "dashboard.html";

/* ---------- Storage helpers ---------- */

// Accounts created through the Sign up form
function getSavedUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Demo account + saved accounts
function getAllUsers() {
  return [DEMO_USER, ...getSavedUsers()];
}

function findUser(username) {
  return getAllUsers().find(u => u.username === username.trim().toLowerCase());
}

/* ---------- Helpers other pages can use ---------- */

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

// Call at the top of every protected page
function requireAuth() {
  if (!getCurrentUser()) window.location.replace("index.html");
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

/* ---------- Login page wiring ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return; // not on the login page

  // Already logged in? Skip straight to the app.
  if (getCurrentUser()) {
    window.location.replace(HOME_PAGE);
    return;
  }

  const signupForm = document.getElementById("signup-form");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginError = document.getElementById("login-error");
  const signupError = document.getElementById("signup-error");
  const signupOk = document.getElementById("signup-ok");

  // ----- Tabs -----
  function showTab(which) {
    const isLogin = which === "login";
    loginForm.classList.toggle("d-none", !isLogin);
    signupForm.classList.toggle("d-none", isLogin);
    tabLogin.setAttribute("aria-selected", isLogin);
    tabSignup.setAttribute("aria-selected", !isLogin);
    document.title = (isLogin ? "Log in" : "Sign up") + " | Estudiar";
  }
  tabLogin.addEventListener("click", () => showTab("login"));
  tabSignup.addEventListener("click", () => showTab("signup"));

  // ----- Show / hide password -----
  document.querySelectorAll("[data-toggle-pw]").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = document.getElementById(btn.dataset.togglePw);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", show);
    });
  });

  // ----- Error display -----
  function showError(box, message, fields = []) {
    box.textContent = message;
    box.classList.remove("d-none");
    fields.forEach(f => f.classList.add("is-invalid"));
    const card = box.closest("form");
    card.classList.remove("shake");
    void card.offsetWidth; // restart animation
    card.classList.add("shake");
  }

  function clearErrors(form) {
    form.querySelectorAll(".msg").forEach(m => m.classList.add("d-none"));
    form.querySelectorAll(".is-invalid").forEach(f => f.classList.remove("is-invalid"));
  }

  // ----- Log in -----
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors(loginForm);

    const userField = document.getElementById("login-username");
    const passField = document.getElementById("login-password");
    const username = userField.value.trim().toLowerCase();
    const password = passField.value;

    if (!username || !password) {
      const empty = [];
      if (!username) empty.push(userField);
      if (!password) empty.push(passField);
      showError(loginError, "Enter both your username and password.", empty);
      return;
    }

    const user = findUser(username);
    if (!user || user.password !== password) {
      showError(loginError, "Wrong username or password. Check them and try again.", [userField, passField]);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, username: user.username }));
    window.location.href = HOME_PAGE;
  });

  // ----- Sign up -----
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors(signupForm);
    signupOk.classList.add("d-none");

    const nameField = document.getElementById("signup-name");
    const userField = document.getElementById("signup-username");
    const passField = document.getElementById("signup-password");
    const confirmField = document.getElementById("signup-confirm");

    const name = nameField.value.trim();
    const username = userField.value.trim().toLowerCase();
    const password = passField.value;

    if (!name || !username || !password || !confirmField.value) {
      showError(signupError, "Fill in every field to create your account.");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      showError(signupError, "Usernames use 3 to 20 letters, numbers or underscores.", [userField]);
      return;
    }
    if (password.length < 6) {
      showError(signupError, "Use a password with at least 6 characters.", [passField]);
      return;
    }
    if (password !== confirmField.value) {
      showError(signupError, "Passwords don't match. Type them again.", [passField, confirmField]);
      return;
    }
    if (findUser(username)) {
      showError(signupError, "That username is taken. Pick another one.", [userField]);
      return;
    }

    const users = getSavedUsers();
    users.push({ name, username, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    signupForm.reset();
    signupOk.classList.remove("d-none");
    showTab("login");
    document.getElementById("login-username").value = username;
    document.getElementById("login-password").focus();
  });
});
