// Analytics via Umami Cloud: cookieless, no personal data, no consent banner.
//
// Umami counts page views on its own, and link clicks are tagged in the HTML
// with data-umami-event. This file loads Umami and adds the two things it
// can't infer: video plays, and how long a page was actually looked at.

(function () {
  // Umami Cloud > Settings > Websites > Edit > Website ID. Empty = off.
  var WEBSITE_ID = "b6e37233-1c9f-46ea-b4b8-b14ead56edc3";
  if (!WEBSITE_ID) return;

  var tracker = document.createElement("script");
  tracker.defer = true;
  tracker.src = "https://cloud.umami.is/script.js";
  tracker.setAttribute("data-website-id", WEBSITE_ID);
  // Count the live site only, not local previews.
  tracker.setAttribute("data-domains", "rayyyu12.github.io");
  document.head.appendChild(tracker);

  function track(name, data) {
    if (window.umami) window.umami.track(name, data);
  }

  // Video plays. Autoplaying loops are skipped, since they'd count every visit.
  document.querySelectorAll("video:not([autoplay])").forEach(function (video) {
    video.addEventListener("play", function () {
      track("Play video", { video: video.getAttribute("src") });
    }, { once: true });
  });

  // Time on page: visible time only, reported once when the visitor leaves or
  // switches away. Umami sends with keepalive, so it survives the page closing.
  var visibleMs = 0;
  var visibleSince = document.visibilityState === "visible" ? Date.now() : 0;
  var reported = false;

  function range(seconds) {
    if (seconds < 10) return "under 10s";
    if (seconds < 30) return "10-30s";
    if (seconds < 60) return "30-60s";
    if (seconds < 180) return "1-3 min";
    return "3+ min";
  }

  function report() {
    if (visibleSince) {
      visibleMs += Date.now() - visibleSince;
      visibleSince = 0;
    }
    if (reported) return;
    reported = true;
    var seconds = Math.round(visibleMs / 1000);
    track("Time on page", { seconds: seconds, range: range(seconds) });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") report();
    else if (!reported) visibleSince = Date.now();
  });
  window.addEventListener("pagehide", report);

  // Coming back with the browser's back button restores the page from cache;
  // treat that as a fresh view.
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) return;
    visibleMs = 0;
    visibleSince = Date.now();
    reported = false;
  });
})();
