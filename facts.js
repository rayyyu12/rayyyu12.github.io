// Rotating fun fact on the home page. Shows a random one per visit, moves on
// every few seconds, and the "Another" button skips ahead. Rotation pauses
// while the fact is hovered or focused and while the tab is hidden, and is off
// for visitors who ask for reduced motion. The facts live in index.html.

(function () {
  var ROTATE_MS = 6000;
  var FADE_MS = 500;  // matches the .fact-item transition in style.css

  var box = document.querySelector(".fact");
  var text = document.querySelector(".fact-text");
  var next = document.querySelector(".fact-next");
  var facts = Array.prototype.map.call(
    document.querySelectorAll(".fact-list li"),
    function (li) { return li.textContent.trim(); }
  );
  if (!box || !text || !next || facts.length < 2) return;

  var calm = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Shuffle once, then walk the order, so nothing repeats until all are seen.
  for (var i = facts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = facts[i];
    facts[i] = facts[j];
    facts[j] = swap;
  }

  text.textContent = "";
  var items = facts.map(function (fact) {
    var item = document.createElement("span");
    item.className = "fact-item";
    item.textContent = fact;
    item.setAttribute("aria-hidden", "true");
    text.appendChild(item);
    return item;
  });

  var index = 0;
  var timer = 0;
  var hovered = false;
  var focused = false;

  // Only changes the visitor asked for are read out by screen readers.
  function show(to, announce) {
    var from = items[index];
    if (to !== index) {
      from.classList.remove("is-active");
      from.classList.add("is-leaving");
      from.setAttribute("aria-hidden", "true");
      setTimeout(function () {
        if (!from.classList.contains("is-active")) from.classList.remove("is-leaving");
      }, FADE_MS);
    }
    index = to;
    text.setAttribute("aria-live", announce ? "polite" : "off");
    items[to].classList.remove("is-leaving");
    items[to].classList.add("is-active");
    items[to].removeAttribute("aria-hidden");
  }

  function schedule() {
    clearTimeout(timer);
    if (calm || hovered || focused || document.hidden) return;
    timer = setTimeout(function () {
      show((index + 1) % items.length, false);
      schedule();
    }, ROTATE_MS);
  }

  show(0, false);
  next.hidden = false;

  next.addEventListener("click", function () {
    show((index + 1) % items.length, true);
    schedule();
  });
  box.addEventListener("mouseenter", function () { hovered = true; schedule(); });
  box.addEventListener("mouseleave", function () { hovered = false; schedule(); });
  box.addEventListener("focusin", function () { focused = true; schedule(); });
  box.addEventListener("focusout", function () { focused = false; schedule(); });
  document.addEventListener("visibilitychange", schedule);

  schedule();
})();
