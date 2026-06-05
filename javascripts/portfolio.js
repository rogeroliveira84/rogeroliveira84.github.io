/* ============================================================
   Roger Oliveira — portfolio behaviour
   Theme toggle · typewriter · live GitHub stars · scroll reveal
   ============================================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- current year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- theme toggle (persisted) ---- */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "light" ? "#f4f5f0" : "#0a0e14");
    });
  }

  /* ---- typewriter: cycle the role line ---- */
  var typed = document.querySelector(".typed");
  if (typed && !reduceMotion) {
    var roles;
    try { roles = JSON.parse(typed.getAttribute("data-roles") || "[]"); } catch (e) { roles = []; }
    if (roles.length) {
      var ri = 0, ci = 0, deleting = false;
      typed.textContent = "";
      var tick = function () {
        var word = roles[ri];
        typed.textContent = word.slice(0, ci);
        var delay;
        if (!deleting) {
          ci++;
          delay = 65;
          if (ci > word.length) { deleting = true; delay = 1800; }
        } else {
          ci--;
          delay = 32;
          if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 320; }
        }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 700);
    }
  }

  /* ---- live GitHub star counts (graceful fallback) ---- */
  var counts = document.querySelectorAll(".star-count");
  if (counts.length && "fetch" in window) {
    fetch("https://api.github.com/users/rogeroliveira84/repos?per_page=100", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        var byName = {};
        repos.forEach(function (repo) { byName[repo.name] = repo.stargazers_count; });
        counts.forEach(function (el) {
          var n = byName[el.getAttribute("data-repo")];
          if (typeof n === "number") el.textContent = String(n);
        });
      })
      .catch(function () { /* keep the baked-in counts */ });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }
})();
