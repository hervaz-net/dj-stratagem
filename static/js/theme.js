(function () {
  var key = "djs-theme";
  try {
    var stored = localStorage.getItem(key);
    document.documentElement.setAttribute("data-theme", stored === "night" ? "night" : "sheet");
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "sheet");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-pressed", document.documentElement.getAttribute("data-theme") === "night" ? "true" : "false");
    }
    var banner = document.getElementById("cookie-banner");
    try {
      if (banner && localStorage.getItem("djs-cookie") === "1") banner.hidden = true;
    } catch (error) {
      /* storage unavailable; leave the notice visible */
    }
    var nav = document.getElementById("site-nav");
    if (nav) {
      nav.addEventListener("change", function () {
        document.body.classList.toggle("overflow-hidden", nav.checked);
      });
    }
  });

  document.addEventListener("click", function (event) {
    var themeButton = event.target.closest("[data-theme-toggle]");
    if (themeButton) {
      var next = document.documentElement.getAttribute("data-theme") === "night" ? "sheet" : "night";
      document.documentElement.setAttribute("data-theme", next);
      themeButton.setAttribute("aria-pressed", next === "night" ? "true" : "false");
      try {
        localStorage.setItem(key, next);
      } catch (error) {
        /* ignore */
      }
    }
    if (event.target.closest("[data-cookie-ok]")) {
      var notice = document.getElementById("cookie-banner");
      if (notice) notice.hidden = true;
      try {
        localStorage.setItem("djs-cookie", "1");
      } catch (error) {
        /* ignore */
      }
    }
  });
})();
