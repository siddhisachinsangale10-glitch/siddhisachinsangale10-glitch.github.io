document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    const closeMenu = () => {
        if (!menuButton || !sidebar) return;
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        sidebar.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    };

    if (menuButton && sidebar) {
        menuButton.addEventListener("click", () => {
            const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            sidebar.classList.toggle("is-open", isOpen);
            document.body.classList.toggle("menu-open", isOpen);
        });
        navLinks.forEach((link) => link.addEventListener("click", closeMenu));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }

    const setActiveLink = (sectionId) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    };

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
        document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveLink(entry.target.id);
            });
        }, { rootMargin: "-35% 0px -55% 0px" });
        sections.forEach((section) => sectionObserver.observe(section));
    } else {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    }

    const contactForm = document.querySelector("#contact-form");
    const formNote = document.querySelector("#form-note");
    if (contactForm instanceof HTMLFormElement && formNote) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;

            const formData = new FormData(contactForm);
            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const message = String(formData.get("message") || "").trim();
            const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
            window.location.href = `mailto:siddhisachinsangale10@gmail.com?subject=${subject}&body=${body}`;
            formNote.textContent = "Your email app should open with your note ready to send.";
        });
    }
});
