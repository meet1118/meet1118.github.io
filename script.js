const assignments = Array.from({ length: 9 }, (_, i) => {
  const n = i + 1;
  return {
    title: `Assignment ${n}`,
    description: "Add a short description of what you did for this assignment.",
    tags: ["COM354"],
    liveUrl: "",
    repoUrl: "",
  };
});

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, String(value));
  });
  children.forEach((child) => node.append(child));
  return node;
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  grid.replaceChildren();

  assignments.forEach((p) => {
    const title = el("h3", { text: p.title });

    const tagRow = el(
      "div",
      { className: "tagrow" },
      (p.tags ?? []).map((t) => el("span", { className: "tag", text: t }))
    );

    const top = el("div", { className: "card__top" }, [el("div", {}, [title, tagRow])]);

    const desc = el("p", { className: "card__desc", text: p.description });

    const links = el("div", { className: "card__links" });
    if (p.liveUrl) {
      links.append(el("a", { href: p.liveUrl, target: "_blank", rel: "noreferrer", text: "Live" }));
    }
    if (p.repoUrl) {
      links.append(el("a", { href: p.repoUrl, target: "_blank", rel: "noreferrer", text: "Code" }));
    }

    const card = el("article", { className: "card" }, [top, desc, links]);
    grid.append(card);
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    links.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement && target.getAttribute("href")?.startsWith("#")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const message = String(fd.get("message") ?? "");

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);

    window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;
  });
}

function setupYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

renderProjects();
setupNav();
setupContactForm();
setupYear();

