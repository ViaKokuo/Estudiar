/* ==========================================================
   Estudiar - members page logic
   Needs: auth.js, data.js
   - Search box filters rows.
   - Click a column header (desktop) or use the sort menu (any screen).
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) return; // layout.js redirects to the login page

  const body = document.getElementById("member-body");
  const searchBox = document.getElementById("member-search");
  const sortSelect = document.getElementById("member-sort");
  const countText = document.getElementById("member-count");
  const emptyBox = document.getElementById("member-empty");
  const table = document.querySelector(".data-table");
  const headers = document.querySelectorAll(".data-table th[data-key]");

  // Current sort. Starts on "most hours this week".
  let sortKey = "hours";
  let sortDir = "desc";
  let query = "";

  // Makes text safe to put inside HTML
  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  const fmt = h => (Math.round(h * 100) / 100).toString();

  // ----- Sorting -----
  function compare(a, b) {
    let x = a[sortKey];
    let y = b[sortKey];
    let result;
    if (typeof x === "string") result = x.localeCompare(y);
    else result = Number(x) - Number(y); // numbers and true/false
    return sortDir === "asc" ? result : -result;
  }

  // ----- Draw the table -----
  function render() {
    const rows = MEMBERS
      .filter(m => !query || (m.name + " " + m.course + " " + m.subject).toLowerCase().includes(query))
      .sort(compare);

    countText.textContent = "Showing " + rows.length + " of " + MEMBERS.length + " members";
    emptyBox.classList.toggle("d-none", rows.length > 0);
    table.classList.toggle("d-none", rows.length === 0);

    // data-label is what shows as the line label on phones
    body.innerHTML = rows.map(m => `
      <tr>
        <td class="cell-name">
          <span class="member-cell">
            <span class="avatar-chip" aria-hidden="true">${esc(m.initials)}</span>${esc(m.name)}
          </span>
        </td>
        <td data-label="Course">${esc(m.course)}</td>
        <td data-label="Top subject">${esc(m.subject)}</td>
        <td data-label="Hours this week">${fmt(m.hours)} h</td>
        <td data-label="Active days">${m.days} / 7</td>
        <td data-label="Status">
          <span class="status ${m.studying ? "on" : "off"}"><i aria-hidden="true"></i>${m.studying ? "Studying now" : "Offline"}</span>
        </td>
      </tr>`).join("");

    // Show the arrow on the sorted column (for screen readers too)
    headers.forEach(th => {
      th.setAttribute("aria-sort",
        th.dataset.key === sortKey ? (sortDir === "asc" ? "ascending" : "descending") : "none");
    });

    // Keep the sort menu in step when it has a matching option
    const match = sortKey + "-" + sortDir;
    if ([...sortSelect.options].some(o => o.value === match)) sortSelect.value = match;
  }

  // ----- Events -----
  headers.forEach(th => {
    th.querySelector("button").addEventListener("click", () => {
      const key = th.dataset.key;
      if (key === sortKey) {
        sortDir = sortDir === "asc" ? "desc" : "asc"; // same column: flip direction
      } else {
        sortKey = key;
        // numbers and status start high-to-low, text starts A to Z
        sortDir = ["hours", "days", "studying"].includes(key) ? "desc" : "asc";
      }
      render();
    });
  });

  sortSelect.addEventListener("change", () => {
    const [key, dir] = sortSelect.value.split("-");
    sortKey = key;
    sortDir = dir;
    render();
  });

  searchBox.addEventListener("input", () => {
    query = searchBox.value.trim().toLowerCase();
    render();
  });

  render();
});
