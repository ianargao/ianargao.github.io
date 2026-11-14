
(function () {
    /* ---- tabs ---- */
    var tabs = document.querySelectorAll('.tab');
    var panes = document.querySelectorAll('.pane');
    var viewport = document.querySelector('.viewport');

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            tabs.forEach(function (t) {
                var active = t === tab;
                t.classList.toggle('active', active);
                t.setAttribute('aria-selected', String(active));
            });

            panes.forEach(function (p) {
                p.classList.toggle('active', p.id === tab.dataset.tab);
            });

            if (viewport) viewport.scrollTop = 0;
        });
    });

    /* ---- tech skills accordion ---- */
    var skills = document.querySelectorAll('.skill');

    skills.forEach(function (skill) {
        var head = skill.querySelector('.s-head');
        var small = skill.querySelector('small');
        var tools = skill.querySelectorAll('.tools li');
        var n = tools.length;

        if (small) {
            small.textContent = n + (n === 1 ? ' skill' : ' skills');
        }

        if (!head) return;

        head.addEventListener('click', function () {
            var open = !skill.classList.contains('open');

            skills.forEach(function (s) {
                s.classList.remove('open');

                var otherHead = s.querySelector('.s-head');
                if (otherHead) {
                    otherHead.setAttribute('aria-expanded', 'false');
                }
            });

            if (open) {
                skill.classList.add('open');
                head.setAttribute('aria-expanded', 'true');

                setTimeout(function () {
                    skill.scrollIntoView({
                        block: 'nearest',
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });

    /* ---- projects carousel ---- */
    var track = document.getElementById('carousel');
    var cards = track ? track.querySelectorAll('.pcard') : [];
    var count = document.getElementById('pcount');
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');

    function updateCount() {
        var visible = 0;

        cards.forEach(function (card) {
            if (!card.hidden) visible++;
        });

        if (count) {
            count.textContent =
                (visible < 10 ? '0' : '') + visible + ' SELECTED WORKS';
        }
    }

    function step(dir) {
        if (!track) return;

        var first = track.querySelector('.pcard:not([hidden])');
        if (!first) return;

        var styles = window.getComputedStyle(track);
        var gap = parseFloat(styles.columnGap) || 28;

        track.scrollBy({
            left: dir * (first.offsetWidth + gap),
            behavior: 'smooth'
        });
    }

    if (prev) {
        prev.addEventListener('click', function () {
            step(-1);
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            step(1);
        });
    }

    updateCount();

    /* ---- theme helper ---- */
    function setTheme(theme) {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);

        try {
            localStorage.setItem('ianargao-theme', theme);
            localStorage.setItem('theme', theme);
        } catch (e) {}
    }

    function getCurrentTheme() {
        return document.documentElement.classList.contains('light')
            ? 'light'
            : 'dark';
    }

    /* ---- existing theme button ---- */
    var oldThemeButton = document.getElementById('theme');

    if (oldThemeButton) {
        oldThemeButton.addEventListener('click', function () {
            setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    /* ---- settings dock ---- */
    var dock = document.getElementById('settingsDock');
    var dockToggle = document.getElementById('dockSettingsToggle');
    var dockThemeToggle = document.getElementById('themeToggle');
    var themeIcon = document.getElementById('themeIcon');

    if (dock && dockToggle) {
        dockToggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            var isOpen = dock.classList.toggle('open');
            dockToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    if (dockThemeToggle) {
        dockThemeToggle.addEventListener('click', function () {
            var newTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);

            if (themeIcon) {
                themeIcon.innerHTML = newTheme === 'dark'
                    ? '<circle cx="12" cy="12" r="4"/>' +
                      '<path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42 ' +
                      'M17.65 17.65l1.42 1.42M2 12h2M20 12h2 ' +
                      'M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>'
                    : '<path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 ' +
                      '8.5 8.5 0 1 0 20.5 15.5z"/>';
            }
        });
    }

})();


/* =========================================
   PORTFOLIO SKELETON LOADER
   ========================================= */

(function () {

    function initPortfolioLoader() {

        var loader = document.getElementById("portfolioSkeleton");

        if (!loader) return;

        // Check URL parameter
        var params = new URLSearchParams(window.location.search);
        var skipLoader = params.get("skipLoader") === "1";

        if (skipLoader) {

            loader.classList.add("hidden");
            loader.remove();

            // Clean URL
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.hash
            );

            return;
        }

        // Normal visit: 5-second loading screen
        var minimumDuration = 5000;
        var startTime = Date.now();
        var finished = false;

        function hideLoader() {

            if (finished) return;
            finished = true;

            var elapsed = Date.now() - startTime;
            var remaining = Math.max(0, minimumDuration - elapsed);

            setTimeout(function () {

                loader.classList.add("hidden");

                setTimeout(function () {
                    if (loader.parentNode) {
                        loader.remove();
                    }
                }, 500);

            }, remaining);
        }

        if (document.readyState === "complete") {
            hideLoader();
        } else {
            window.addEventListener("load", hideLoader, {
                once: true
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPortfolioLoader, {
            once: true
        });
    } else {
        initPortfolioLoader();
    }

})();


/* =========================================
   BUILD PHONE SKELETON WITH REAL SHIMMER
========================================= */

(function () {

    function buildPhoneSkeleton() {

        if (!window.matchMedia("(max-width: 1000px)").matches) {
            return;
        }

        const originalShell = document.querySelector(".shell");
        const skeletonWindow = document.getElementById("skeletonWindow");

        if (!originalShell || !skeletonWindow) return;
        if (skeletonWindow.querySelector(".skeleton-live-clone")) return;

        const clone = originalShell.cloneNode(true);

        clone.classList.add("skeleton-live-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.removeAttribute("id");

        clone.querySelectorAll("[id]").forEach(function (element) {
            element.removeAttribute("id");
        });

        clone.querySelectorAll("input, button, a").forEach(function (element) {
            element.removeAttribute("tabindex");
            element.setAttribute("tabindex", "-1");
        });

        const targets = clone.querySelectorAll(
            ".photo, .name, .portfolio-note, .contact li, " +
            ".social a, .tab, .path, .about-text, .banner, " +
            ".edu-logo, .edu h3, .edu .yrs, .edu .deg, " +
            ".tl-node, .tl .yr, .tl h3, .tl .desc, " +
            ".pimg, .pbody small, .pbody h3, .pbody .tech, " +
            ".s-ico, .s-txt, .tools i, .chips li, .foot"
        );

        targets.forEach(function (element) {

            element.classList.add("phone-shimmer");

            const gloss = document.createElement("span");
            gloss.className = "phone-shimmer-gloss";
            gloss.setAttribute("aria-hidden", "true");

            element.appendChild(gloss);
        });

        skeletonWindow.appendChild(clone);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", buildPhoneSkeleton);
    } else {
        buildPhoneSkeleton();
    }

})();
/* ================= THEME TOOLTIP ================= */

(function () {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    function updateThemeTooltip() {
        const isDark = document.documentElement.classList.contains("dark");
        const message = isDark ? "Light Mode" : "Dark Mode";

        themeToggle.setAttribute("data-tooltip", message);
        themeToggle.setAttribute("aria-label", message);
    }

    // Initial tooltip
    updateThemeTooltip();

    // Update after theme changes
    themeToggle.addEventListener("click", function () {
        requestAnimationFrame(updateThemeTooltip);
    });

})();
/* =========================================
   MOBILE SETTINGS DOCK - CLOSE ON OUTSIDE TAP
========================================= */

document.addEventListener("click", function (e) {

    if (!window.matchMedia("(max-width: 480px)").matches) {
        return;
    }

    const dock = document.querySelector(".settings-dock");

    if (!dock || !dock.classList.contains("open")) {
        return;
    }

    // Kapag sa loob ng dock pinindot, huwag isara
    if (dock.contains(e.target)) {
        return;
    }

    // Kapag sa labas pinindot, isara ang menu
    dock.classList.remove("open");

});

/* =========================================
   EMAILJS CONTACT FORM
========================================= */

(function () {

    const contactToggle = document.getElementById("contactToggle");
    const contactModal = document.getElementById("contactModal");
    const contactClose = document.getElementById("contactClose");
    const contactForm = document.getElementById("contactForm");
    const contactSubmit = document.getElementById("contactSubmit");
    const contactStatus = document.getElementById("contactStatus");

    if (
        !contactToggle ||
        !contactModal ||
        !contactClose ||
        !contactForm ||
        !contactSubmit ||
        !contactStatus
    ) {
        console.error("Contact form elements are missing.");
        return;
    }

    if (!window.emailjs) {
        console.error("EmailJS library is not loaded.");
        return;
    }

    emailjs.init({
        publicKey: "dCCzLOM_gFM2Re-0q"
    });

    // OPEN MODAL
    contactToggle.addEventListener("click", function (e) {
        e.preventDefault();

        contactModal.classList.add("open");
        contactModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });

    // CLOSE MODAL
    function closeContact() {
        contactModal.classList.remove("open");
        contactModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    contactClose.addEventListener("click", closeContact);

    contactModal.addEventListener("click", function (e) {
        if (e.target === contactModal) {
            closeContact();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (
            e.key === "Escape" &&
            contactModal.classList.contains("open")
        ) {
            closeContact();
        }
    });

    // SEND EMAIL
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";
        contactStatus.textContent = "";

        const templateParams = {
            from_name: document.getElementById("contactName").value.trim(),
            from_email: document.getElementById("contactEmail").value.trim(),
            subject: document.getElementById("contactSubject").value.trim(),
            message: document.getElementById("contactMessage").value.trim()
        };

        try {
            await emailjs.send(
                "service_dsr598j",
                "template_9mpaewb",
                templateParams
            );

            contactStatus.textContent = "Message sent successfully!";
            contactStatus.style.color = "#22c55e";

            contactForm.reset();

        } catch (error) {
            console.error("EmailJS Error:", error);

            contactStatus.textContent =
                "Unable to send message. Please try again.";

            contactStatus.style.color = "#ef4444";

        } finally {
            contactSubmit.disabled = false;
            contactSubmit.textContent = "Send Message";
        }
    });

})();