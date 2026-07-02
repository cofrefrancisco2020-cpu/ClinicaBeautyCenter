const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const consultForm = document.querySelector("[data-consult-form]");
const formNote = document.querySelector("[data-form-note]");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

consultForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(consultForm);
  const treatment = data.get("treatment");
  const goal = data.get("goal")?.toString().trim();
  const message = `Hola Beauty Center, quiero consultar por ${treatment}${goal ? `. Mi objetivo es: ${goal}` : ""}.`;

  const clipboardWrite = navigator.clipboard?.writeText
    ? navigator.clipboard.writeText(message)
    : Promise.reject(new Error("Clipboard unavailable"));

  clipboardWrite.then(
    () => {
      formNote.textContent = "Consulta copiada. Se abrirá Instagram para enviarla.";
      window.open("https://www.instagram.com/clinica.beautycenter/", "_blank", "noreferrer");
    },
    () => {
      formNote.textContent = message;
      window.open("https://www.instagram.com/clinica.beautycenter/", "_blank", "noreferrer");
    }
  );
});
