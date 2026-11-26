const typed = document.querySelector(".typed");
const phrases = typed ? JSON.parse(typed.dataset.phrases || "[]") : [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typed && phrases.length) {
  if (reduceMotion) {
    typed.textContent = phrases[0];
  } else {
    let phrase = 0;
    let length = 0;
    let deleting = false;
    const tick = () => {
      const text = phrases[phrase];
      length += deleting ? -1 : 1;
      typed.textContent = text.slice(0, length);
      let delay = deleting ? 35 : 70;
      if (!deleting && length === text.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && length === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    };
    tick();
  }
}

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const navLinks = [...document.querySelectorAll(".nav ul a")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const card = tab.closest(".code-card");
    card.querySelectorAll(".tab").forEach((t) => {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
    });
    card.querySelectorAll(".pane").forEach((p) => { p.hidden = p.dataset.pane !== tab.dataset.tab; });
  });
});

const revealTargets = document.querySelectorAll(".stat, .job, .card, .skillset, section h2, section .sub");
if (!reduceMotion && "IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => io.observe(el));
}

const counters = document.querySelectorAll(".count[data-to]");
const animateCount = (el) => {
  const to = parseFloat(el.dataset.to);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  if (!to) return;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / 1400, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (to * eased).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
if (!reduceMotion && "IntersectionObserver" in window) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      co.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => co.observe(el));
}
