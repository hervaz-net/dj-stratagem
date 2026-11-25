(function () {
  var key = "djs-theme";

  function nightOn() {
    return document.documentElement.getAttribute("data-theme") === "night";
  }

  function paintTheme() {
    var night = nightOn();
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.setAttribute("aria-pressed", night ? "true" : "false");
      button.textContent = night ? "Day sheet" : "Night sheet";
    });
    var color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute("content", night ? "#141613" : "#f4f5f1");
  }

  function setTheme(next) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(key, next);
    } catch (error) {
      /* storage unavailable */
    }
    paintTheme();
  }

  function navInput() {
    return document.getElementById("site-nav");
  }

  function setInert(on) {
    ["main", "footer", "#cookie-banner"].forEach(function (selector) {
      var el = document.querySelector(selector);
      if (el) el.inert = on;
    });
  }

  function onNavChange() {
    var input = navInput();
    var nav = document.getElementById("mobile-nav");
    if (!input) return;
    setInert(input.checked);
    if (input.checked) {
      var close = document.querySelector("[data-nav-close]");
      if (close) close.focus();
    } else if (nav && nav.contains(document.activeElement)) {
      input.focus();
    }
  }

  function closeNav() {
    var input = navInput();
    if (!input || !input.checked) return;
    input.checked = false;
    onNavChange();
    input.focus();
  }

  document.addEventListener("DOMContentLoaded", function () {
    paintTheme();
    var banner = document.getElementById("cookie-banner");
    try {
      if (banner && localStorage.getItem("djs-cookie") === "1") banner.hidden = true;
    } catch (error) {
      /* leave the notice visible */
    }
    var input = navInput();
    if (input) input.addEventListener("change", onNavChange);
  });

  document.addEventListener("click", function (event) {
    var themeButton = event.target.closest("[data-theme-toggle]");
    if (themeButton) {
      setTheme(nightOn() ? "sheet" : "night");
      return;
    }
    if (event.target.closest("[data-cookie-ok]")) {
      var notice = document.getElementById("cookie-banner");
      if (notice) notice.hidden = true;
      document.documentElement.classList.add("cookie-ok");
      try {
        localStorage.setItem("djs-cookie", "1");
      } catch (error) {
        /* ignore */
      }
      return;
    }
    if (event.target.closest("#mobile-nav a")) closeNav();
    if (!event.target.closest("details")) {
      document.querySelectorAll("header details[open]").forEach(function (item) {
        item.removeAttribute("open");
      });
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNav();
      document.querySelectorAll("header details[open]").forEach(function (item) {
        item.removeAttribute("open");
        var summary = item.querySelector("summary");
        if (summary) summary.focus();
      });
    }
    var input = navInput();
    var nav = document.getElementById("mobile-nav");
    if (event.key !== "Tab" || !input || !input.checked || !nav) return;
    var focusable = nav.querySelectorAll("a[href], button, label[tabindex]");
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
