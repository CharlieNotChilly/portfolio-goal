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
