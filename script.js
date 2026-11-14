
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

    /* ---- projects: search + carousel ---- */
    var track = document.getElementById('carousel');
    var cards = track ? track.querySelectorAll('.pcard') : [];
    var count = document.getElementById('pcount');
    var none = document.getElementById('noresult');
    var search = document.getElementById('psearch');
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

        if (none) {
            none.hidden = visible !== 0;
        }
    }

    if (search) {
        search.addEventListener('input', function (e) {
            var q = e.target.value.trim().toLowerCase();

            cards.forEach(function (card) {
                card.hidden = q !== '' &&
                    card.textContent.toLowerCase().indexOf(q) === -1;
            });

            if (track) track.scrollTo({ left: 0 });

            updateCount();
        });
    }

    function step(dir) {
        if (!track) return;

        var first = track.querySelector('.pcard:not([hidden])');
        if (!first) return;

        track.scrollBy({
            left: dir * (first.offsetWidth + 28),
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

    /* ---- existing theme button, if present ---- */
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

/* =================================
   PORTFOLIO LOADING SCREEN
================================= */

(function () {
    var loader = document.getElementById('portfolioSkeleton');

    if (!loader) return;

    var startTime = Date.now();

    function hideLoader() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, 3000 - elapsed);

        setTimeout(function () {
            loader.classList.add('hidden');

            setTimeout(function () {
                loader.remove();
            }, 500);

        }, remaining);
    }

    if (document.readyState === 'complete') {
        hideLoader();
    } else {
        window.addEventListener('load', hideLoader, { once: true });
    }
})();
