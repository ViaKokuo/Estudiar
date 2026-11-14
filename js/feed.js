/* ==========================================================
   Estudiar - feed page logic
   Needs: auth.js, data.js
   New posts are saved in localStorage (this browser only).
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser();
  if (!user) return; // layout.js redirects to the login page

  // Posts made through the form are saved in localStorage, so they
  // survive a refresh and show up for any account in this browser.
  const POSTS_KEY = "estudiar_posts";

  function getSavedPosts() {
    try {
      return JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function savePosts() {
    // Only user-made posts have a "created" time; sample posts are not saved
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts.filter(p => p.created)));
  }

  // Turns a saved timestamp into "Just now", "12 min ago", "3 h ago"...
  function timeLabel(ts) {
    const mins = Math.floor((Date.now() - ts) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return mins + " min ago";
    if (mins < 1440) return Math.floor(mins / 60) + " h ago";
    return Math.floor(mins / 1440) + " d ago";
  }

  // Saved posts first (newest on top), then the sample posts
  const savedPosts = getSavedPosts().map(p => ({ ...p, time: timeLabel(p.created), liked: false }));
  const posts = [
    ...savedPosts,
    ...FEED_POSTS.map((p, i) => ({ ...p, id: i + 1, liked: false }))
  ];
  let activeFilter = "All";
  let query = "";

  const list = document.getElementById("post-list");
  const chipRow = document.getElementById("chip-row");
  const searchBox = document.getElementById("feed-search");
  const countText = document.getElementById("feed-count");

  // Makes text safe to put inside HTML
  function esc(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function subjectColor(name) {
    const found = SUBJECTS.find(s => s.name === name);
    return found ? found.color : "#aaa7e0";
  }

  function initialsOf(name) {
    return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  }

  // ----- Filter chips -----
  function renderChips() {
    const names = ["All", ...SUBJECTS.map(s => s.name)];
    chipRow.innerHTML = names.map(n =>
      `<button type="button" class="chip" data-filter="${esc(n)}" aria-pressed="${n === activeFilter}">${esc(n)}</button>`
    ).join("");
  }

  chipRow.addEventListener("click", e => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    renderChips();
    renderPosts();
  });

  searchBox.addEventListener("input", () => {
    query = searchBox.value.trim().toLowerCase();
    renderPosts();
  });

  // ----- Post cards -----
  function renderPosts() {
    const shown = posts.filter(p => {
      const matchesSubject = activeFilter === "All" || p.subject === activeFilter;
      const matchesSearch = !query || (p.text + " " + p.name).toLowerCase().includes(query);
      return matchesSubject && matchesSearch;
    });

    countText.textContent = "Showing " + shown.length + " of " + posts.length + " posts";

    if (shown.length === 0) {
      list.innerHTML = '<div class="empty-state">No posts match. Clear the search or pick another subject.</div>';
      return;
    }

    list.innerHTML = shown.map(p => `
      <article class="post-card">
        <div class="post-head">
          <span class="avatar-chip" aria-hidden="true">${esc(p.initials)}</span>
          <div>
            <div class="name">${esc(p.name)}</div>
            <div class="when">${esc(p.time)}</div>
          </div>
        </div>
        <p class="post-text">${esc(p.text)}</p>
        <div class="post-foot">
          <span class="tag"><i style="background:${subjectColor(p.subject)}"></i>${esc(p.subject)}</span>
          <span class="mins">${p.minutes} min</span>
          <button type="button" class="like-btn" data-like="${p.id}" aria-pressed="${p.liked}"
                  aria-label="Like this post, ${p.likes} likes">&hearts; ${p.likes}</button>
        </div>
      </article>`).join("");
  }

  // ----- Likes (one like per post, click again to undo) -----
  list.addEventListener("click", e => {
    const btn = e.target.closest("[data-like]");
    if (!btn) return;
    const post = posts.find(p => p.id === Number(btn.dataset.like));
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    renderPosts();
  });

  // ----- New post form -----
  const form = document.getElementById("post-form");
  const subjectSelect = document.getElementById("post-subject");
  const minutesField = document.getElementById("post-minutes");
  const textField = document.getElementById("post-text");
  const errorBox = document.getElementById("post-error");

  subjectSelect.innerHTML = SUBJECTS.map(s => `<option>${esc(s.name)}</option>`).join("");

  function showError(message, field) {
    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
    if (field) field.classList.add("is-invalid");
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    errorBox.classList.add("d-none");
    form.querySelectorAll(".is-invalid").forEach(f => f.classList.remove("is-invalid"));

    const minutes = Number(minutesField.value);
    const text = textField.value.trim();

    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) {
      showError("Enter the minutes studied, from 1 to 600.", minutesField);
      return;
    }
    if (text.length < 5) {
      showError("Write at least a few words about what you studied.", textField);
      return;
    }

    // Newest post goes to the top
    posts.unshift({
      id: Date.now(),
      name: user.name,
      initials: initialsOf(user.name),
      subject: subjectSelect.value,
      minutes: minutes,
      created: Date.now(),
      time: "Just now",
      likes: 0,
      liked: false,
      text: text
    });
    savePosts();

    form.reset();
    activeFilter = "All";
    query = "";
    searchBox.value = "";
    renderChips();
    renderPosts();
  });

  renderChips();
  renderPosts();
});
