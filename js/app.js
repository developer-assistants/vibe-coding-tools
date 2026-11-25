let tools = [];
let activeFilter = 'all';
let activeGoal = 'website-no-code';
let searchQuery = '';
let showAll = false;
let compareIds = ['cursor', 'claude-code', 'lovable'];

const gridEl = document.getElementById('tool-grid');
const statusEl = document.getElementById('directory-status');
const searchEl = document.getElementById('tool-search');
const filterTrayEl = document.getElementById('filter-tray');
const goalTrayEl = document.getElementById('goal-tray');
const goalResultsEl = document.getElementById('goal-results');
const goalCountEl = document.getElementById('goal-count');
const loadMoreWrapEl = document.getElementById('load-more-wrap');
const showAllBtnEl = document.getElementById('show-all-btn');
const compareControlsEl = document.getElementById('compare-controls');
const compareHeadEl = document.getElementById('compare-head');
const compareBodyEl = document.getElementById('compare-body');

const modalEl = document.getElementById('detail-modal');
const closeModalEl = document.getElementById('close-modal');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getFilteredTools() {
  const q = searchQuery.trim().toLowerCase();
  return tools.filter((tool) => {
    if (activeFilter === 'free' && tool.pricingTier !== 'Free') return false;
    if (activeFilter === 'open-source' && !tool.openSource) return false;
    if (
      (activeFilter === 'No-code' || activeFilter === 'AI IDE' || activeFilter === 'CLI Agents') &&
      tool.category !== activeFilter
    ) {
      return false;
    }
    if (!q) return true;
    const hay = `${tool.name} ${tool.tagline} ${tool.bestFor} ${tool.category} ${tool.codeExport}`.toLowerCase();
    return hay.includes(q);
  });
}

function renderGoalMatcher() {
  const matched = tools.filter((t) => t.goals.includes(activeGoal));
  goalCountEl.textContent = `${matched.length} matches`;
  goalResultsEl.innerHTML = matched
    .slice(0, 3)
    .map(
      (tool) => `
      <div class="goal-row">
        <div>
          <strong>${escapeHtml(tool.name)}</strong>
          <div><span>${escapeHtml(tool.bestFor)}</span></div>
        </div>
        <a class="text-link" href="${escapeHtml(tool.officialUrl)}" target="_blank" rel="noreferrer">Visit</a>
      </div>`,
    )
    .join('');
}

function renderDirectory() {
  const filtered = getFilteredTools();
  const isDefaultView = activeFilter === 'all' && !searchQuery.trim();
  const visible = showAll || !isDefaultView ? filtered : filtered.slice(0, 4);

  statusEl.textContent =
    visible.length === filtered.length
      ? `Showing ${filtered.length} of ${tools.length} vibe coding tools.`
      : `Showing ${visible.length} featured picks out of ${filtered.length} tools.`;

  if (visible.length === 0) {
    gridEl.innerHTML = '<p>No tools match the current search and filter.</p>';
    loadMoreWrapEl.hidden = true;
    return;
  }

  gridEl.innerHTML = visible
    .map(
      (tool) => `
      <article class="cut tool-card">
        <div>
          <div class="tool-top">
            <h3>${escapeHtml(tool.name)}</h3>
            <span class="mono-val">${escapeHtml(tool.pricingTier)}</span>
          </div>
          <p class="tool-tagline" style="margin-top: var(--space-xs);">${escapeHtml(tool.tagline)}</p>
          <div class="tool-meta" style="margin-top: var(--space-sm);">
            <span>${escapeHtml(tool.category)}</span>
            <span>Best for: ${escapeHtml(tool.bestFor)}</span>
            <span>${tool.openSource ? 'Open source' : 'Proprietary'}</span>
          </div>
        </div>
        <div class="tool-actions">
          <button type="button" class="tray-key" data-inspect="${escapeHtml(tool.id)}">Details</button>
          <a class="text-link" href="${escapeHtml(tool.officialUrl)}" target="_blank" rel="noreferrer">Visit</a>
        </div>
      </article>`,
    )
    .join('');

  loadMoreWrapEl.hidden = showAll || !isDefaultView || filtered.length <= 4;
  showAllBtnEl.textContent = `Show all ${filtered.length} tools`;
}

function renderComparison() {
  compareControlsEl.innerHTML = compareIds
    .map(
      (selectedId, idx) => `
      <label>
        <span class="visually-hidden">Compare tool ${idx + 1}</span>
        <select class="select-field" data-compare-slot="${idx}" style="width: 100%;">
          ${tools
            .map(
              (t) =>
                `<option value="${escapeHtml(t.id)}" ${t.id === selectedId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`,
            )
            .join('')}
        </select>
      </label>`,
    )
    .join('');

  const selected = compareIds
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean);

  compareHeadEl.innerHTML = `
    <tr>
      <th>Feature</th>
      ${selected.map((t) => `<th>${escapeHtml(t.name)}</th>`).join('')}
    </tr>`;

  const rows = [
    ['Category', (t) => escapeHtml(t.category), false],
    ['Pricing', (t) => escapeHtml(t.pricingTier), false],
    ['Open source', (t) => (t.openSource ? 'Yes' : 'No'), true],
    ['Best for', (t) => escapeHtml(t.bestFor), false],
    [
      'Links',
      (t) =>
        `<a class="text-link" href="${escapeHtml(t.officialUrl)}" target="_blank" rel="noreferrer">Site</a>` +
        (t.githubUrl
          ? ` / <a class="text-link" href="${escapeHtml(t.githubUrl)}" target="_blank" rel="noreferrer">GitHub</a>`
          : ''),
      false,
    ],
  ];

  compareBodyEl.innerHTML = rows
    .map(
      ([label, getter, highlight]) => `
      <tr class="${highlight ? 'row-highlight' : ''}">
        <th>${label}</th>
        ${selected.map((t) => `<td>${getter(t)}</td>`).join('')}
      </tr>`,
    )
    .join('');
}

function openModal(toolId) {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return;
  document.getElementById('modal-title').textContent = tool.name;
  document.getElementById('modal-tagline').textContent = tool.tagline;
  document.getElementById('modal-meta').innerHTML = `
    <span>${escapeHtml(tool.category)}</span>
    <span>${escapeHtml(tool.pricingDetail)}</span>
    <span>${tool.openSource ? escapeHtml(tool.license) : 'Proprietary'}</span>
  `;
  document.getElementById('modal-export').textContent = tool.codeExport;
  document.getElementById('modal-pros').innerHTML = tool.pros.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
  document.getElementById('modal-cons').innerHTML = tool.cons.map((c) => `<li>${escapeHtml(c)}</li>`).join('');
  document.getElementById('modal-links').innerHTML =
    `<a class="key key--primary" href="${escapeHtml(tool.officialUrl)}" target="_blank" rel="noreferrer">Visit official site</a>` +
    (tool.githubUrl
      ? `<a class="key" href="${escapeHtml(tool.githubUrl)}" target="_blank" rel="noreferrer">GitHub repository</a>`
      : '');
  modalEl.hidden = false;
  closeModalEl.focus();
}

function setFilter(nextFilter) {
  activeFilter = nextFilter;
  filterTrayEl.querySelectorAll('.tray-key').forEach((btn) => {
    btn.classList.toggle('tray-key--active', btn.dataset.filter === nextFilter);
  });
  renderDirectory();
}

filterTrayEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-filter]');
  if (!btn) return;
  setFilter(btn.dataset.filter);
});

goalTrayEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-goal]');
  if (!btn) return;
  activeGoal = btn.dataset.goal;
  goalTrayEl.querySelectorAll('.tray-key').forEach((b) => {
    b.classList.toggle('tray-key--active', b.dataset.goal === activeGoal);
  });
  renderGoalMatcher();
});

searchEl.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderDirectory();
});

showAllBtnEl.addEventListener('click', () => {
  showAll = true;
  renderDirectory();
});

gridEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-inspect]');
  if (btn) openModal(btn.dataset.inspect);
});

compareControlsEl.addEventListener('change', (e) => {
  const sel = e.target.closest('[data-compare-slot]');
  if (!sel) return;
  compareIds[Number(sel.dataset.compareSlot)] = sel.value;
  renderComparison();
});

closeModalEl.addEventListener('click', () => {
  modalEl.hidden = true;
});

modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) modalEl.hidden = true;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalEl.hidden) modalEl.hidden = true;
});

document.querySelectorAll('[data-quick-filter]').forEach((link) => {
  link.addEventListener('click', () => {
    setFilter(link.dataset.quickFilter);
  });
});

async function init() {
  const res = await fetch('./data/tools.json');
  tools = await res.json();
  renderGoalMatcher();
  renderDirectory();
  renderComparison();
}

init();
