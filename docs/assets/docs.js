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
                html += `<span class="kw">${all}</span>`;
            } else if(call) {
                html += `<span class="fn">${call}</span>`;
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

// every reference entry of the other pages, loaded on the first search
let otherEntries = null;
async function loadOtherEntries() {
    if(otherEntries) {
        return otherEntries;
    }
    const parser = new DOMParser();
    const loaded = await Promise.all(PAGES.filter(([file]) => file !== currentPage).map(async ([file, title]) => {
        try {
            const response = await fetch(file);
            const doc = parser.parseFromString(await response.text(), 'text/html');
            return [...doc.querySelectorAll('.ref')].map((entry) => ({
                file,
                title,
                id: entry.id,
                name: entry.dataset.name || '',
                signature: entry.querySelector('h3 code')?.textContent || entry.dataset.name || '',
                summary: entry.querySelector('p')?.textContent || '',
                text: entry.textContent.toLowerCase()
            }));
        } catch(_) {
            return [];
        }
    }));
    otherEntries = loaded.flat();
    return otherEntries;
}

function setUpSearch() {
    const input = document.getElementById('search');
    const count = document.getElementById('search-count');
    const results = document.getElementById('results');
    const entries = [...document.querySelectorAll('.ref')];
    const groups = [...document.querySelectorAll('section.group')];
    const texts = entries.map((entry) => entry.textContent.toLowerCase());
    let run = 0;

    async function search() {
        const query = input.value.trim().toLowerCase();
        const thisRun = ++run;
        let shown = 0;
        entries.forEach((entry, index) => {
            const hit = !query || (entry.dataset.name || '').toLowerCase().includes(query) || texts[index].includes(query);
            entry.hidden = !hit;
            if(hit) {
                shown++;
            }
        });
        groups.forEach((group) => {
            group.hidden = query !== '' && !group.querySelector('.ref:not([hidden])') && group.querySelector('.ref') !== null;
        });
        results.innerHTML = '';
        if(!query) {
            count.textContent = entries.length ? `${entries.length} entries on this page` : '';
            return;
        }
        count.textContent = `${shown} on this page`;
        const others = (await loadOtherEntries()).filter((entry) => entry.name.toLowerCase().includes(query) || entry.text.includes(query));
        if(thisRun !== run) {
            return;
        }
        count.textContent = `${shown} on this page, ${others.length} on other pages`;
        if(others.length === 0) {
            return;
        }
        // name matches first
        others.sort((a, b) => Number(!a.name.toLowerCase().includes(query)) - Number(!b.name.toLowerCase().includes(query)));
        const heading = document.createElement('h2');
        heading.textContent = 'On other pages';
        results.appendChild(heading);
        for(const entry of others.slice(0, 60)) {
            const hit = document.createElement('div');
            hit.className = 'hit';
            hit.innerHTML = `<div class="page">${escapeHtml(entry.title)}</div><a href="${entry.file}#${entry.id}"><code>${escapeHtml(entry.signature)}</code></a><div>${escapeHtml(entry.summary.slice(0, 220))}</div>`;
            results.appendChild(hit);
        }
    }

    try {
        input.value = sessionStorage.getItem('jigoku-docs-search') || '';
    } catch(_) {
        // storage can be blocked; the search still works
    }
    input.addEventListener('input', () => {
        try {
            sessionStorage.setItem('jigoku-docs-search', input.value);
        } catch(_) {
            // see above
        }
        search();
    });
    document.addEventListener('keydown', (event) => {
        if(event.key === '/' && document.activeElement !== input) {
            event.preventDefault();
            input.focus();
        }
    });
    search();
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
