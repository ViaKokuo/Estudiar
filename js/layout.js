/* ==========================================================
   Estudiar - shared layout (navbar + footer)
   Every logged-in page has:
     <body class="app" data-page="dashboard">
     <div id="app-navbar"></div> ... <div id="app-footer"></div>
   and loads auth.js BEFORE this file.
   To add a page to the menu, add it to PAGES below.
   ========================================================== */

// Menu items. "key" must match the data-page value on each page.
const PAGES = [
  { key: "dashboard", label: "Dashboard", href: "dashboard.html" },
  { key: "feed",      label: "Feed",      href: "feed.html" },
  { key: "members",   label: "Members",   href: "members.html" }
];

// Sample notifications (static for the prototype)
const NOTIFICATIONS = [
  { text: "Aina invited you to Web Wizards", time: "10 min ago" },
  { text: "Your study group meets tomorrow at 8:00 PM", time: "2 h ago" },
  { text: "You hit 6 active days this week", time: "Yesterday" }
];

document.addEventListener("DOMContentLoaded", () => {
  requireAuth(); // sends logged-out visitors back to the login page
  const user = getCurrentUser();
  if (!user) return;

  const current = document.body.dataset.page;
  const initials = user.name
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // ----- Navbar -----
  const links = PAGES.map(p => `
    <li class="nav-item">
      <a class="nav-link ${p.key === current ? "active" : ""}" href="${p.href}"
         ${p.key === current ? 'aria-current="page"' : ""}>${p.label}</a>
    </li>`).join("");

  const notifs = NOTIFICATIONS.map(n => `
    <li><span class="dropdown-item notif-item">${n.text}<small>${n.time}</small></span></li>`).join("");

  const navbar = `
  <nav class="navbar navbar-expand-lg app-nav sticky-top" aria-label="Main navigation">
    <div class="container">
      <a class="brand" href="dashboard.html"><span class="brand-dot" aria-hidden="true"></span>Estudiar</a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#main-nav" aria-controls="main-nav"
              aria-expanded="false" aria-label="Toggle menu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="main-nav">
        <ul class="navbar-nav me-auto ms-lg-4 mb-2 mb-lg-0">${links}</ul>

        <div class="d-flex align-items-center gap-3 pb-2 pb-lg-0">
          <!-- Notifications -->
          <div class="dropdown">
            <button class="btn-icon" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false" aria-label="Notifications, ${NOTIFICATIONS.length} new">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
              </svg>
              <span class="notif-badge">${NOTIFICATIONS.length}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Notifications</h6></li>
              ${notifs}
            </ul>
          </div>

          <!-- Account menu -->
          <div class="dropdown">
            <button class="avatar-sm" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false" aria-label="Account menu">${initials}</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header" id="nav-username"></h6></li>
              <li><button class="dropdown-item" type="button" id="logout-btn">Log out</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>`;

  // ----- Footer -----
  const footer = `
  <footer class="app-footer">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6">
          <a class="brand mb-2" href="dashboard.html"><span class="brand-dot" aria-hidden="true"></span>Estudiar</a>
          <p class="mb-0">A study buddy network for students. Share what you're studying, join groups and log your sessions.</p>
        </div>
        <div class="col-6 col-md-3">
          <h2>Pages</h2>
          <ul>${PAGES.map(p => `<li><a href="${p.href}">${p.label}</a></li>`).join("")}</ul>
        </div>
        <div class="col-6 col-md-3">
          <h2>About</h2>
          <ul>
            <li>Course project: IMS566</li>
            <li>Built with Bootstrap 5 and Chart.js</li>
          </ul>
        </div>
      </div>
      <hr style="border-color: var(--line)">
      <p class="mb-0">&copy; 2026 Estudiar. All rights reserved.</p>
    </div>
  </footer>`;

  document.getElementById("app-navbar").innerHTML = navbar;
  document.getElementById("app-footer").innerHTML = footer;

  // User's name is added as text (not HTML) to keep it safe
  document.getElementById("nav-username").textContent = user.name;
  document.getElementById("logout-btn").addEventListener("click", logout);
});
