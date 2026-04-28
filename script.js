const assignments = Array.from({ length: 9 }, (_, i) => {
  const n = i + 1;
  return {
    title: `Assignment ${n}`,
    tabLabel: `Assignment ${n}`,
    description: "Add a short description of what you did for this assignment.",
    tags: ["COM354"],
    gallery: [],
    imageUrl: "",
    liveUrl: "",
    repoUrl: "",
  };
});

assignments[0] = {
  title: "Drawing Project",
  tabLabel: "Drawing Project",
  description:
    "This scene is meaningful to me because it shows the different parts of my life coming together in one place. The desk, computer, and circuit diagram represent my passion for electrical engineering and my personality as someone who enjoys working hard, thinking logically, and solving problems. The mountains represent calmness and balance, reminding me to stay grounded and motivated. The road and vehicle represent my personal journey, including the move from India to America in 2013, which shaped who I am today and pushed me to grow and adapt. Overall, this drawing represents my interests, background, and goals, and it shows how my past and present connect to who I am becoming.",
  tags: ["COM354"],
  imageUrl: "./assets/assignment-1.png",
  liveUrl: "",
  repoUrl: "",
};

assignments[1] = {
  title: "Course Website",
  tabLabel: "Course Website",
  description:
    "For this assignment, I created my personal course website to host all my work throughout the semester. This site serves as a central portfolio where I organized and displayed each assignment in a clean and structured way.",
  tags: ["COM354"],
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
};

assignments[2] = {
  title: "Audio Project",
  tabLabel: "Audio Project",
  description:
    "This project involved recording and editing an audio clip under two minutes long. I used audio editing tools to enhance the recording with sound effects and sound bites, focusing on improving the listener’s experience and understanding audio storytelling techniques.",
  tags: ["COM354"],
  gallery: [],
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
};

assignments[3] = {
  title: "Photo Project",
  tabLabel: "Photo Project",
  description: "Photos and captions will be added here.",
  tags: ["COM354"],
  gallery: [
    {
      src: "./assets/assignment-4-1.png",
      alt: "Sunset shoreline photo",
      caption:
        "Composition Techniques: Rule of Thirds, Leading Lines, Negative Space, Layering\n\nThe shoreline and horizon follow the rule of thirds while the open sky creates negative space and the landscape layers add depth.",
    },
    {
      src: "./assets/assignment-4-2.png",
      alt: "Beach framed by trees photo",
      caption:
        "Composition Techniques: Frame in a Frame, Leading Lines, Layering, Multiple Points of Interest\n\nThe surrounding trees create a natural frame while the stairs lead the viewer’s eye toward the beach and ocean.",
    },
    {
      src: "./assets/assignment-4-3.png",
      alt: "Mountains and lake photo",
      caption:
        "Composition Techniques: Rule of Thirds, Negative space\n\nThe mountains are placed along the lower third while the large sky creates negative space that emphasizes the landscape.",
    },
  ],
  imageUrl: "",
  liveUrl: "",
  repoUrl: "",
};

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
      text: a.tabLabel ?? `Assignment ${idx + 1}`,
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

    const media = a.imageUrl
      ? el("img", {
          className: "assignment__image",
          src: a.imageUrl,
          alt: `${a.title} image`,
          loading: "lazy",
        })
      : null;

    const desc = el("p", { className: "card__desc assignment__text", text: a.description });

    const gallery =
      Array.isArray(a.gallery) && a.gallery.length > 0
        ? el(
            "div",
            { className: "gallery", "aria-label": `${a.title} gallery` },
            a.gallery.map((item, i) => {
              const img = el("img", {
                className: "gallery__image",
                src: item.src,
                alt: item.alt ?? `${a.title} photo ${i + 1}`,
                loading: "lazy",
              });
              const caption = el("p", { className: "gallery__caption", text: item.caption ?? "" });
              return el("figure", { className: "gallery__item" }, [img, caption]);
            })
          )
        : null;

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

    const children = [heading, tagRow];
    if (media) children.push(media);
    if (gallery) children.push(gallery);
    children.push(desc, links);

    panelInner.replaceChildren(...children);
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

