// Shared by every page of the card builder reference.

// the pages and their titles come from assets/search-index.js (docs/agent-tools/docs-index.py writes them);
// this list is only the fallback
const PAGES = (window.PAGES || [
    { file: 'index.html', title: 'Getting started' },
    { file: 'builder.html', title: 'Ability builder' },
    { file: 'game-actions.html', title: 'Game actions' },
    { file: 'effects.html', title: 'Effects' },
    { file: 'costs.html', title: 'Costs and limits' },
    { file: 'types.html', title: 'Enums, events and context' },
    { file: 'helpers.html', title: 'Card helpers and queries' },
    { file: 'engine.html', title: 'Engine internals' }
]);
const pageTitles = new Map(PAGES.map(({ file, title }) => [file, title]));

// GitHub Pages also serves the pages without .html
const currentPage = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') + '.html';
const narrowScreen = window.matchMedia('(max-width: 860px)');

function shorten(text, length) {
    if(text.length <= length) {
        return text;
    }
    return text.slice(0, text.lastIndexOf(' ', length)) + ' …';
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// a tiny TypeScript highlighter: keywords, strings, numbers, comments, calls
function highlight(root) {
    const keywords = /^(import|from|export|default|class|extends|const|let|return|if|else|new|this|true|false|undefined|null|function|static|private|public|readonly|type|as|of|in|async|await)$/;
    // these are often property names: { type: … }
    const propertyLike = /^(type|as|of|in)$/;
    const token = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()|\b([A-Za-z_]\w*)\b/g;
    for(const block of root.querySelectorAll('pre > code')) {
        const text = block.textContent;
        const fragment = document.createDocumentFragment();
        const add = (content, className) => {
            if(!content) {
                return;
            }
            if(!className) {
                fragment.appendChild(document.createTextNode(content));
                return;
            }
            const span = document.createElement('span');
            span.className = className;
            span.textContent = content;
            fragment.appendChild(span);
        };
        let last = 0;
        for(const match of text.matchAll(token)) {
            const [all, comment, string, number, call, word] = match;
            const end = match.index + all.length;
            add(text.slice(last, match.index));
            if(comment) {
                add(comment, 'com');
            } else if(string) {
                add(string, 'str');
            } else if(number) {
                add(number, 'num');
            } else if(keywords.test(call || word) && !(propertyLike.test(all) && /^\s*\??:/.test(text.slice(end)))) {
                add(all, 'kw');
            } else if(call) {
                add(call, 'fn');
            } else {
                add(all);
            }
            last = end;
        }
        add(text.slice(last));
        block.replaceChildren(fragment);
    }
}

function anchorLink(id, label) {
    const link = document.createElement('a');
    link.className = 'anchor';
    link.href = '#' + id;
    link.textContent = '#';
    link.setAttribute('aria-label', label);
    return link;
}

// a "Skip to content" link first, and # links on the headings
function addLandmarks() {
    const main = document.querySelector('main');
    if(!main.id) {
        main.id = 'content';
    }
    const skip = document.createElement('a');
    skip.className = 'skip';
    skip.href = '#' + main.id;
    skip.textContent = 'Skip to content';
    document.body.prepend(skip);

    for(const anchor of document.querySelectorAll('.ref > h3 a.anchor')) {
        anchor.setAttribute('aria-label', 'Link to this entry');
    }
    for(const heading of main.querySelectorAll('h2[id], h3[id]')) {
        if(!heading.querySelector('a.anchor')) {
            heading.append(' ', anchorLink(heading.id, 'Link to this section'));
        }
    }
}

// tables scroll sideways in a wrapper, so they can stay real tables
function wrapTables() {
    for(const table of document.querySelectorAll('main table')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-scroll';
        table.replaceWith(wrapper);
        wrapper.appendChild(table);
    }
}

function buildNavigation() {
    const pages = document.getElementById('pages');
    for(const { file, title } of PAGES) {
        const link = document.createElement('a');
        link.href = file;
        link.textContent = title;
        if(file === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
        pages.appendChild(link);
    }
    // this page's contents: its h2s and the h3s with an id under them (entries have their id on the .ref)
    const toc = document.getElementById('toc');
    const top = document.createElement('ol');
    const links = new Map();
    let current = null;
    for(const heading of document.querySelectorAll('main h2[id], main h3[id]')) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.dataset.toc || heading.textContent;
        item.appendChild(link);
        links.set(heading, link);
        if(heading.tagName === 'H2') {
            current = document.createElement('ol');
            item.appendChild(current);
            top.appendChild(item);
        } else if(current) {
            current.appendChild(item);
        } else {
            top.appendChild(item);
        }
    }
    for(const list of top.querySelectorAll('ol')) {
        if(!list.children.length) {
            list.remove();
        }
    }
    toc.appendChild(top);

    // on small screens the page list and contents fold away under one summary line
    const panel = document.createElement('details');
    panel.className = 'nav-panel';
    const summary = document.createElement('summary');
    summary.textContent = 'Pages and contents';
    pages.before(panel);
    panel.append(summary, pages, toc);
    const fit = () => {
        panel.open = !narrowScreen.matches;
    };
    fit();
    narrowScreen.addEventListener('change', fit);

    followSections(links);
}

// mark the TOC link of the section being read
function followSections(links) {
    if(!('IntersectionObserver' in window) || !links.size) {
        return;
    }
    const headings = [...links.keys()];
    const sidebar = document.querySelector('aside.sidebar');
    let active = null;
    const activate = (heading) => {
        const link = heading && links.get(heading);
        if(link === active) {
            return;
        }
        active?.classList.remove('active');
        active = link;
        if(!link) {
            return;
        }
        link.classList.add('active');
        // keep it in view in the sidebar, which scrolls on its own on wide screens only
        if(!narrowScreen.matches) {
            const box = link.getBoundingClientRect();
            const view = sidebar.getBoundingClientRect();
            if(box.top < view.top || box.bottom > view.bottom) {
                sidebar.scrollTop += box.top - view.top - view.height / 2;
            }
        }
    };
    // the section being read is the last heading above the line at 30% of the window. The observer only
    // says that some heading crossed that line; the current one is worked out once per batch, so the
    // initial report of every heading on page load doesn't walk the sidebar through all of them.
    const update = () => {
        const line = window.innerHeight * 0.3;
        let current = headings[0];
        for(const heading of headings) {
            if(heading.getBoundingClientRect().top > line) {
                break;
            }
            current = heading;
        }
        activate(current);
    };
    const observer = new IntersectionObserver(update, { rootMargin: '0px 0px -70% 0px' });
    headings.forEach((heading) => observer.observe(heading));
}

// previous and next page, and back to the top
function addFooter() {
    const index = PAGES.findIndex(({ file }) => file === currentPage);
    const footer = document.createElement('footer');
    footer.className = 'page-footer';
    const link = (href, text, rel) => {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        if(rel) {
            a.rel = rel;
        }
        return a;
    };
    const previous = PAGES[index - 1];
    const next = index >= 0 ? PAGES[index + 1] : null;
    footer.append(
        previous ? link(previous.file, '← ' + previous.title, 'prev') : document.createElement('span'),
        link('#top', 'Back to top'),
        next ? link(next.file, next.title + ' →', 'next') : document.createElement('span')
    );
    document.querySelector('main').appendChild(footer);
}

// assets/search-index.js lists every entry and section of every page, and the rows of the card text tables
const STOPWORDS = new Set(['a', 'an', 'the', 'of', 'to', 'you', 'your', 'or', 'and']);
const searchIndex = (window.SEARCH_INDEX || []).map((entry) => {
    const bare = entry.signature.replace(/\(.*$/, '');
    // the names an entry is found by: its own, then other names (data-aka); the signature counts as one
    const names = [...entry.name.split(' '), ...(entry.aka || []), bare]
        .filter(Boolean)
        .map((raw, index) => ({ raw, lower: raw.toLowerCase(), primary: index === 0 || raw === bare }));
    return {
        ...entry,
        names,
        keys: (entry.keys || []).map((raw) => ({ raw, lower: raw.toLowerCase() })),
        values: (entry.values || []).map((raw) => ({ raw, lower: raw.toLowerCase() })),
        title: entry.signature.toLowerCase(),
        summaryText: entry.summary.toLowerCase(),
        text: `${entry.name} ${(entry.aka || []).join(' ')} ${entry.signature} ${entry.summary} ${(entry.keys || []).join(' ')} ${(entry.values || []).join(' ')}`.toLowerCase()
    };
});
const pageOrder = new Map(PAGES.map(({ file }, index) => [file, index]));
// this page first, then the pages in order
const rank = (entry) => (entry.file === currentPage ? -1 : pageOrder.get(entry.file) ?? PAGES.length);

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// query starts a word of raw: at its start, after a non-word character, or at a camelCase hump
function startsWord(raw, query) {
    const lower = raw.toLowerCase();
    for(let at = lower.indexOf(query); at >= 0; at = lower.indexOf(query, at + 1)) {
        if(at === 0 || /[A-Z]/.test(raw[at]) || /\W/.test(raw[at - 1])) {
            return true;
        }
    }
    return false;
}

function parseQuery(text) {
    const query = text.trim().toLowerCase().replace(/\s+/g, ' ');
    const words = query.split(' ');
    const terms = words.filter((word) => !STOPWORDS.has(word));
    // Owner.member, such as Players.Self or EventName.OnCardBowed
    const [, owner, member] = query.match(/^([\w$]+)\.([\w$]+)$/) || [];
    return {
        query, terms: terms.length ? terms : words, compact: words.join(''), owner, member,
        phrase: new RegExp(`\\b${escapeRegExp(query)}\\b`)
    };
}

// how well an entry matches, and which of its names matched
function score(entry, { query, terms, compact, phrase, owner, member }) {
    const best = (score, name) => ({ score, name: name || null });
    // Players.Self: the value Self of the entry Players
    if(owner && entry.names.some((name) => name.lower === owner)) {
        const value = [...entry.values, ...entry.keys].find((name) => name.lower === member);
        if(value) {
            return best(110, value);
        }
    }
    const exact = entry.names.find((name) => name.lower === compact || name.lower === query);
    if(exact) {
        return best(100, exact);
    }
    const prefix = entry.names.find((name) => name.lower.startsWith(compact) || name.lower.startsWith(query));
    if(prefix) {
        return best(80, prefix);
    }
    // a parameter or property in the entry's tables
    const key = entry.keys.find((name) => name.lower === compact);
    if(key) {
        return best(70, key);
    }
    if(phrase.test(entry.title)) {
        return best(70);
    }
    const wordStart = entry.names.find((name) => startsWord(name.raw, compact) || startsWord(name.raw, query));
    if(wordStart) {
        return best(65, wordStart);
    }
    if(startsWord(entry.signature, query)) {
        return best(65);
    }
    // an enum's value: below the names, as Honored is also isHonored, onCardHonored, …
    const value = entry.values.find((name) => name.lower === compact);
    if(value) {
        return best(60, value);
    }
    if(phrase.test(entry.summaryText)) {
        return best(50);
    }
    const inside = entry.names.find((name) => name.lower.includes(compact));
    if(inside) {
        return best(30, inside);
    }
    if(terms.every((term) => entry.text.includes(term))) {
        return best(terms.every((term) => entry.title.includes(term)) ? 25 : 20);
    }
    return best(0);
}

// the best matches first: by score, then the shortest matching name, then this page and the page order
function search(text) {
    const parsed = parseQuery(text);
    const found = new Map();
    const run = (query) => {
        for(const entry of searchIndex) {
            const match = score(entry, query);
            if(match.score > (found.get(entry)?.score || 0)) {
                found.set(entry, { entry, ...match });
            }
        }
    };
    run(parsed);
    // EventName.OnCardBowed: also look for the part after the dot
    if(parsed.member) {
        run(parseQuery(parsed.member));
    }
    const length = (match) => (match.name ? match.name.raw : match.entry.signature).length;
    // a card text row and the entry it points to are one result
    const places = new Set();
    const matches = [...found.values()]
        .sort((a, b) => b.score - a.score || length(a) - length(b) || rank(a.entry) - rank(b.entry))
        .filter(({ entry }) => !places.has(entry.file + '#' + entry.id) && places.add(entry.file + '#' + entry.id));
    return { matches: matches.slice(0, 40), terms: parsed.member ? [parsed.query, parsed.member] : parsed.terms };
}

function marked(text, terms) {
    const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
    return text.split(pattern).map((part, index) => (index % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part))).join('');
}

function setUpSearch() {
    const input = document.getElementById('search');
    const list = document.getElementById('jump');
    let matches = [];
    let selected = 0;

    function place() {
        const box = input.getBoundingClientRect();
        list.style.top = `${box.bottom + 6}px`;
        list.style.left = `${Math.max(8, Math.min(box.left, window.innerWidth - list.offsetWidth - 8))}px`;
    }

    function close() {
        list.hidden = true;
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
    }

    function select(index) {
        selected = index;
        list.querySelectorAll('[role="option"]').forEach((option, optionIndex) => {
            option.setAttribute('aria-selected', String(optionIndex === index));
            if(optionIndex === index) {
                option.scrollIntoView({ block: 'nearest' });
                input.setAttribute('aria-activedescendant', option.id);
            }
        });
    }

    function render({ entry, name }, index, terms) {
        const href = entry.file === currentPage ? `#${entry.id}` : `${entry.file}#${entry.id}`;
        const kind = entry.kind || (entry.section ? 'Section' : '');
        const where = [kind, pageTitles.get(entry.file) || entry.page].filter(Boolean).join(' · ');
        // found by another of its names: show that name first
        const label = name && !name.primary ?
            `${marked(name.raw, terms)} <span class="in">— in ${escapeHtml(entry.signature.replace(/\(.+\)$/, '(…)'))}</span>` :
            marked(entry.signature, terms);
        return `<a role="option" id="jump-${index}" href="${href}" class="${entry.section ? 'section' : ''}">` +
            `<span class="name">${label}</span><span class="where">${escapeHtml(where)}</span>` +
            `<span class="summary">${marked(shorten(entry.summary, 200), terms)}</span></a>`;
    }

    function update() {
        if(!input.value.trim()) {
            close();
            return;
        }
        const result = search(input.value);
        matches = result.matches;
        if(matches.length === 0) {
            list.innerHTML = '<div class="empty">Nothing matches. The search covers entry names and signatures, their parameters, ' +
                'properties and enum values, section headings, and the card text tables; try a function name such as <code>sendHome</code>. ' +
                'Spec helpers (<code>clickCard</code>, <code>setupTest</code>) are in <a href="index.html#start-testing">Testing a card</a> on the start page.</div>';
        } else {
            list.innerHTML = matches.map((match, index) => render(match, index, result.terms)).join('');
        }
        list.hidden = false;
        input.setAttribute('aria-expanded', 'true');
        place();
        select(0);
    }

    input.addEventListener('input', update);
    input.addEventListener('focus', update);
    input.addEventListener('keydown', (event) => {
        if(event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if(matches.length) {
                select((selected + (event.key === 'ArrowDown' ? 1 : matches.length - 1)) % matches.length);
            }
        } else if(event.key === 'Enter') {
            const option = list.querySelector('[aria-selected="true"]');
            if(option && !list.hidden) {
                event.preventDefault();
                close();
                location.href = option.getAttribute('href');
            }
        } else if(event.key === 'Escape') {
            input.value = '';
            close();
        }
    });
    list.addEventListener('mousedown', (event) => {
        // keep the focus in the input until the link is followed
        event.preventDefault();
    });
    list.addEventListener('click', (event) => {
        if(event.target.closest('a')) {
            close();
        }
    });
    input.addEventListener('blur', close);
    window.addEventListener('resize', () => !list.hidden && place());
    document.addEventListener('keydown', (event) => {
        if(event.key === '/' && document.activeElement !== input) {
            event.preventDefault();
            input.focus();
        }
    });
}

// the start page's card text and code light up together, part by part: on hover, on focus, and
// pinned by a click (or Enter / Space)
function linkCardToCode() {
    for(const panel of document.querySelectorAll('.card-to-code')) {
        const lines = [...panel.querySelectorAll('[data-line]')];
        let pinned = null;
        const show = (id) => lines.forEach((line) => line.classList.toggle('lit', line.dataset.line === id));
        const pin = (id) => {
            pinned = pinned === id ? null : id;
            show(pinned);
        };
        for(const line of lines) {
            const id = line.dataset.line;
            line.tabIndex = 0;
            line.addEventListener('mouseenter', () => show(id));
            line.addEventListener('mouseleave', () => show(pinned));
            line.addEventListener('focus', () => show(id));
            line.addEventListener('blur', () => show(pinned));
            line.addEventListener('click', () => pin(id));
            line.addEventListener('keydown', (event) => {
                if(event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    pin(id);
                }
            });
        }
    }
}

highlight(document);
buildNavigation();
addLandmarks();
wrapTables();
addFooter();
setUpSearch();
linkCardToCode();
