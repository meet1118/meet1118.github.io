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

function renderAssignmentTabs() {
  const tabs = document.getElementById("assignmentsTabs");
  const panel = document.getElementById("assignmentPanel");
  if (!tabs || !panel) return;

  tabs.replaceChildren();
  panel.replaceChildren();

  tabs.setAttribute("role", "tablist");

  const tabButtons = assignments.map((a, idx) => {
    const btn = el("button", {
      type: "button",
      className: "tab",
      id: `tab-assignment-${idx + 1}`,
      role: "tab",
      "aria-selected": "false",
      "aria-controls": `panel-assignment-${idx + 1}`,
      tabindex: "-1",
      text: `A${idx + 1}`,
    });

    btn.addEventListener("click", () => setActive(idx, true));
    return btn;
  });

  tabButtons.forEach((b) => tabs.append(b));

  const panelInner = el("div", { id: "panelInner" });
  panel.append(panelInner);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("tabindex", "0");

  function setActive(index, focusTab) {
    const safeIndex = Math.max(0, Math.min(assignments.length - 1, index));

    tabButtons.forEach((b, i) => {
      const isActive = i === safeIndex;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-selected", String(isActive));
      b.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    const a = assignments[safeIndex];
    const heading = el("h3", { className: "h3", text: a.title });

    const tagRow = el(
      "div",
      { className: "tagrow" },
      (a.tags ?? []).map((t) => el("span", { className: "tag", text: t }))
    );

    const desc = el("p", { className: "card__desc", text: a.description });

    const links = el("div", { className: "card__links" });
    if (a.liveUrl) {
      links.append(el("a", { href: a.liveUrl, target: "_blank", rel: "noreferrer", text: "Open" }));
    }
    if (a.repoUrl) {
      links.append(el("a", { href: a.repoUrl, target: "_blank", rel: "noreferrer", text: "Code" }));
    }
    if (!a.liveUrl && !a.repoUrl) {
      links.append(el("span", { className: "muted", text: "Links coming soon." }));
    }

    panelInner.replaceChildren(heading, tagRow, desc, links);
    panel.setAttribute("aria-labelledby", tabButtons[safeIndex].id);
    panel.id = `panel-assignment-${safeIndex + 1}`;

    if (focusTab) tabButtons[safeIndex].focus();
  }

  tabs.addEventListener("keydown", (e) => {
    const currentIndex = tabButtons.findIndex((b) => b.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive(currentIndex + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive(currentIndex - 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(assignments.length - 1, true);
    }
  });

  setActive(0, false);
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

function setupYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

renderAssignmentTabs();
setupNav();
setupYear();

