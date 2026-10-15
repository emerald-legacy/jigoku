// Shared by every page of the card builder reference.
const PAGES = [
    ['index.html', 'Getting started'],
    ['builder.html', 'Ability builder'],
    ['game-actions.html', 'Game actions'],
    ['effects.html', 'Effects'],
    ['costs.html', 'Costs and limits'],
    ['types.html', 'Enums, events, types'],
    ['helpers.html', 'Card helpers and queries'],
    ['engine.html', 'Engine internals']
];

const currentPage = location.pathname.split('/').pop() || 'index.html';

function shorten(text, length) {
    if(text.length <= length) {
        return text;
    }
    return text.slice(0, text.lastIndexOf(' ', length)) + ' …';
}

function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// a tiny TypeScript highlighter: keywords, strings, numbers, comments, calls
function highlight(root) {
    const keywords = /^(import|from|export|default|class|extends|const|let|return|if|else|new|this|true|false|undefined|null|function|static|private|public|readonly|type|as|of|in|async|await)$/;
    const token = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(\d+)\b|\b([A-Za-z_]\w*)(?=\()|\b([A-Za-z_]\w*)\b/g;
    for(const block of root.querySelectorAll('pre > code')) {
        const text = block.textContent;
        let html = '';
        let last = 0;
        for(const match of text.matchAll(token)) {
            const [all, comment, string, number, call, word] = match;
            html += escapeHtml(text.slice(last, match.index));
            if(comment) {
                html += `<span class="com">${escapeHtml(comment)}</span>`;
            } else if(string) {
                html += `<span class="str">${escapeHtml(string)}</span>`;
            } else if(number) {
                html += `<span class="num">${number}</span>`;
            } else if(keywords.test(call || word)) {
                html += `<span class="kw">${escapeHtml(all)}</span>`;
            } else if(call) {
                html += `<span class="fn">${escapeHtml(call)}</span>`;
            } else {
                html += escapeHtml(all);
            }
            last = match.index + all.length;
        }
        block.innerHTML = html + escapeHtml(text.slice(last));
    }
}

function buildNavigation() {
    const pages = document.getElementById('pages');
    for(const [file, title] of PAGES) {
        const link = document.createElement('a');
        link.href = file;
        link.textContent = title;
        if(file === currentPage) {
            link.setAttribute('aria-current', 'page');
        }
        pages.appendChild(link);
    }
    // this page's contents: its h2s and the group titles under them
    const toc = document.getElementById('toc');
    const top = document.createElement('ol');
    let current = null;
    for(const heading of document.querySelectorAll('main h2[id], main h3.group-title[id]')) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.dataset.toc || heading.textContent;
        item.appendChild(link);
        if(heading.tagName === 'H2') {
            current = document.createElement('ol');
            item.appendChild(current);
            top.appendChild(item);
        } else if(current) {
            current.appendChild(item);
        }
    }
    toc.appendChild(top);
}

// assets/search-index.js lists every entry and section of every page
const searchIndex = (window.SEARCH_INDEX || []).map((entry) => ({
    ...entry,
    name: entry.name.toLowerCase(),
    title: entry.signature.toLowerCase(),
    text: `${entry.name} ${entry.signature} ${entry.summary}`.toLowerCase()
}));
const pageOrder = new Map(PAGES.map(([file], index) => [file, index]));
// this page first, then the pages in order
const rank = (entry) => (entry.file === currentPage ? -1 : pageOrder.get(entry.file));

// how well an entry matches: its name first, then its signature or heading, then its summary
function score(entry, terms, compact) {
    if(!terms.every((term) => entry.text.includes(term)) && !`${entry.name} ${entry.title}`.includes(compact)) {
        return 0;
    }
    const bare = entry.title.replace(/\(.*$/, '');
    if(entry.name === compact || bare === compact) {
        return 100;
    }
    if(entry.name.startsWith(compact) || entry.title.startsWith(compact)) {
        return 80;
    }
    if(entry.name.includes(compact) || entry.title.includes(compact)) {
        return 60;
    }
    return terms.every((term) => entry.title.includes(term)) ? 40 : 20;
}

function marked(text, terms) {
    const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
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

    function update() {
        const query = input.value.trim().toLowerCase();
        if(!query) {
            close();
            return;
        }
        const terms = query.split(/\s+/);
        const compact = terms.join('');
        matches = searchIndex
            .map((entry) => ({ entry, score: score(entry, terms, compact) }))
            .filter((match) => match.score > 0)
            .sort((a, b) => b.score - a.score || rank(a.entry) - rank(b.entry) || a.entry.title.length - b.entry.title.length)
            .slice(0, 40)
            .map((match) => match.entry);
        if(matches.length === 0) {
            list.innerHTML = '<div class="empty">Nothing matches. Try a function name, such as <code>sendHome</code>.</div>';
        } else {
            list.innerHTML = matches.map((entry, index) => {
                const href = entry.file === currentPage ? `#${entry.id}` : `${entry.file}#${entry.id}`;
                const where = entry.section ? `${entry.page}, section` : entry.page;
                return `<a role="option" id="jump-${index}" href="${href}" class="${entry.section ? 'section' : ''}">` +
                    `<span class="name">${marked(entry.signature, terms)}</span><span class="where">${escapeHtml(where)}</span>` +
                    `<span class="summary">${marked(shorten(entry.summary, 200), terms)}</span></a>`;
            }).join('');
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

// the start page's card text and code light up together, part by part
function linkCardToCode() {
    for(const panel of document.querySelectorAll('.card-to-code')) {
        const lines = [...panel.querySelectorAll('[data-line]')];
        for(const line of lines) {
            const partners = lines.filter((other) => other.dataset.line === line.dataset.line);
            line.addEventListener('mouseenter', () => partners.forEach((partner) => partner.classList.add('lit')));
            line.addEventListener('mouseleave', () => partners.forEach((partner) => partner.classList.remove('lit')));
        }
    }
}

highlight(document);
buildNavigation();
setUpSearch();
linkCardToCode();
