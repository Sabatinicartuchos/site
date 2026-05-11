// Interações principais do site institucional Sabatini Cartuchos.

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navPanel = document.querySelector("[data-nav-panel]");
const currentYear = document.querySelectorAll("[data-current-year]");
const revealItems = document.querySelectorAll(".reveal");
const forms = document.querySelectorAll("[data-contact-form]");
const parallaxTarget = document.querySelector("[data-parallax]");

const closeMenu = () => {
  if (!menuToggle || !navPanel) return;

  menuToggle.classList.remove("is-active");
  navPanel.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setupMenu = () => {
  if (!menuToggle || !navPanel) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
};

const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    });
  });
};

const setupRevealAnimations = () => {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const setupParallax = () => {
  if (!parallaxTarget) return;

  let ticking = false;

  const animate = () => {
    const offset = Math.min(window.scrollY * 0.04, 32);
    parallaxTarget.style.transform = `translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      window.requestAnimationFrame(animate);
      ticking = true;
    },
    { passive: true }
  );
};

const setupForms = () => {
  forms.forEach((form) => {
    const feedback = form.querySelector("[data-form-feedback]");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !phone || !message) {
        if (feedback) {
          feedback.textContent = "Preencha todos os campos para enviar sua mensagem.";
          feedback.classList.add("is-error");
        }
        return;
      }

      if (phone.replace(/\D/g, "").length < 10) {
        if (feedback) {
          feedback.textContent = "Informe um telefone válido com DDD.";
          feedback.classList.add("is-error");
        }
        return;
      }

      if (feedback) {
        feedback.textContent = "Mensagem validada. Nossa equipe entrará em contato em breve.";
        feedback.classList.remove("is-error");
      }

      form.reset();
    });
  });
};

currentYear.forEach((item) => {
  item.textContent = new Date().getFullYear();
});

setupMenu();
setupSmoothScroll();
setupRevealAnimations();
setupParallax();
setupForms();
updateHeader();

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});
