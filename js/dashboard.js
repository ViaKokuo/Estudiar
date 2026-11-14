/* ==========================================================
   Estudiar - dashboard logic
   Needs: Chart.js, auth.js, data.js
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) return; // layout.js redirects to the login page

  // ----- Numbers worked out from the sample data -----
  const subjectTotals = SUBJECTS.map(s => s.hours.reduce((a, b) => a + b, 0));
  const totalHours = subjectTotals.reduce((a, b) => a + b, 0);

  // Sessions = every day/subject cell with time in it
  const sessions = SUBJECTS.reduce((n, s) => n + s.hours.filter(h => h > 0).length, 0);

  // Active days = days with at least one session
  const activeDays = WEEK_DAYS.filter((_, i) => SUBJECTS.some(s => s.hours[i] > 0)).length;

  const fmt = h => (Math.round(h * 100) / 100).toString(); // 4.5, 2.75, ...

  // ----- Header and stat cards -----
  document.getElementById("welcome").textContent = "Welcome back, " + user.name.split(" ")[0];
  document.getElementById("stat-hours").innerHTML = fmt(totalHours) + " <small>h</small>";
  document.getElementById("stat-sessions").textContent = sessions;
  document.getElementById("stat-days").innerHTML = activeDays + " <small>/ 7</small>";
  document.getElementById("stat-groups").textContent = GROUPS_JOINED;

  // ----- Weekly goal -----
  const pct = Math.min(100, Math.round((totalHours / WEEKLY_GOAL_HOURS) * 100));
  const bar = document.getElementById("goal-fill");
  bar.style.width = pct + "%";
  bar.parentElement.setAttribute("aria-valuenow", pct);
  document.getElementById("goal-text").textContent =
    fmt(totalHours) + " of " + WEEKLY_GOAL_HOURS + " hours (" + pct + "%)";

  // ----- Lists -----
  document.getElementById("now-list").innerHTML = STUDYING_NOW.map(p => `
    <li>
      <span class="avatar-chip" aria-hidden="true">${p.initials}</span>
      <div>
        <div>${p.name}: ${p.subject}</div>
        <div class="meta">${p.minutes} min in</div>
      </div>
    </li>`).join("");

  document.getElementById("upcoming-list").innerHTML = UPCOMING.map(u => `
    <li>
      <span class="date-chip">${u.day}<small>${u.date}</small></span>
      <div>
        <div>${u.title}</div>
        <div class="meta">${u.group} &middot; ${u.time}</div>
      </div>
    </li>`).join("");

  // ----- Chart.js dark theme defaults -----
  Chart.defaults.color = "#aaa7e0";
  Chart.defaults.borderColor = "#34299f";
  Chart.defaults.font.family = '"DM Sans", "Segoe UI", system-ui, sans-serif';

  let chart = null;

  // Stacked bar: hours per day, split by subject
  function drawByDay() {
    chart = new Chart(document.getElementById("study-chart"), {
      type: "bar",
      data: {
        labels: WEEK_DAYS,
        datasets: SUBJECTS.map(s => ({
          label: s.name,
          data: s.hours,
          backgroundColor: s.color,
          borderRadius: 4
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, title: { display: true, text: "Hours studied" } }
        },
        plugins: {
          legend: { position: "bottom" },
          tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${fmt(c.parsed.y)} h` } }
        }
      }
    });
  }

  // Doughnut: share of the week's hours per subject
  function drawBySubject() {
    chart = new Chart(document.getElementById("study-chart"), {
      type: "doughnut",
      data: {
        labels: SUBJECTS.map(s => s.name),
        datasets: [{
          data: subjectTotals,
          backgroundColor: SUBJECTS.map(s => s.color),
          borderColor: "#100571",
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: c => ` ${c.label}: ${fmt(c.parsed)} h (${Math.round((c.parsed / totalHours) * 100)}%)`
            }
          }
        }
      }
    });
  }

  // ----- Toggle between the two views -----
  const btnDay = document.getElementById("view-day");
  const btnSubject = document.getElementById("view-subject");

  function setView(view) {
    if (chart) chart.destroy();
    const byDay = view === "day";
    btnDay.setAttribute("aria-pressed", byDay);
    btnSubject.setAttribute("aria-pressed", !byDay);
    byDay ? drawByDay() : drawBySubject();
  }
  btnDay.addEventListener("click", () => setView("day"));
  btnSubject.addEventListener("click", () => setView("subject"));

  // ----- Short written summary under the chart -----
  const topIndex = subjectTotals.indexOf(Math.max(...subjectTotals));
  document.getElementById("insight").textContent =
    "Most of your week went to " + SUBJECTS[topIndex].name + " (" + fmt(subjectTotals[topIndex]) +
    " h). You studied on " + activeDays + " of 7 days.";

  setView("day");
});
