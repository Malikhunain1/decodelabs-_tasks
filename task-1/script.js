(() => {
  const $ = s => document.querySelector(s);
  const garden = $('#garden'), msg = $('#msg');
  const key = d => d.toLocaleDateString('en-CA');
  const today = () => key(new Date());
  const load = () => { try { return JSON.parse(localStorage.getItem('sprout')); } catch { return null; } };
  const save = () => { try { localStorage.setItem('sprout', JSON.stringify(habits)); } catch {} };

  let habits = load() || [
    { id: 1, name: 'Drink 2L of water', color: '#4FA3E0', days: [] },
    { id: 2, name: 'Read 20 pages', color: '#8E7CC3', days: [] },
    { id: 3, name: 'Practice coding', color: '#E8618C', days: [] }
  ];
  let filter = 'all';

  const streak = h => {
    const d = new Date(); let n = 0;
    if (!h.days.includes(key(d))) d.setDate(d.getDate() - 1);
    while (h.days.includes(key(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  };
  const stage = s => s >= 7 ? 3 : s >= 3 ? 2 : s >= 1 ? 1 : 0;
  const stageName = ['Seed', 'Sprout', 'Leafy', 'In bloom'];
  const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function plant(st, color) {
    const leaf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="4.5" transform="rotate(${r} ${x} ${y})" fill="var(--leaf)"/>`;
    let g = '<ellipse cx="50" cy="90" rx="32" ry="7" fill="var(--soil)"/>';
    if (st === 0) return g + '<ellipse cx="50" cy="85" rx="6" ry="4" fill="var(--seed)"/>';
    const top = [0, 64, 48, 30][st];
    g += `<path d="M50 88 Q47 ${(88 + top) / 2} 50 ${top}" stroke="var(--leaf)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    g += leaf(41, 78, -30) + leaf(59, 72, 30);
    if (st > 1) g += leaf(40, 60, -35) + leaf(60, 54, 35);
    if (st === 3) {
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3;
        g += `<circle cx="${(50 + 9 * Math.cos(a)).toFixed(1)}" cy="${(top + 9 * Math.sin(a)).toFixed(1)}" r="6.5" fill="${color}"/>`;
      }
      g += `<circle cx="50" cy="${top}" r="5" fill="var(--accent)"/>`;
    } else g += `<circle cx="50" cy="${top}" r="3.5" fill="var(--leaf)"/>`;
    return g;
  }

  function render(popId) {
    const t = today();
    const doneCount = habits.filter(h => h.days.includes(t)).length;
    $('#count').textContent = `${doneCount}/${habits.length}`;
    $('#arc').style.strokeDashoffset = 163.4 * (1 - (habits.length ? doneCount / habits.length : 0));
    msg.textContent = !habits.length ? '' : doneCount === habits.length ? 'Your whole garden is watered. See you tomorrow.' : `${habits.length - doneCount} left to water today.`;

    const list = habits.filter(h => filter === 'all' || (filter === 'done') === h.days.includes(t));
    if (!list.length) {
      garden.innerHTML = `<p class="empty">${habits.length ? 'Nothing here yet. Try another filter.' : 'Your garden is empty. Plant your first habit above.'}</p>`;
      return;
    }
    garden.innerHTML = list.map(h => {
      const s = streak(h), done = h.days.includes(t);
      return `<article class="plot ${done ? 'done' : ''} ${h.id === popId ? 'pop' : ''}">
        <div class="sky"><svg viewBox="0 0 100 100" aria-hidden="true">${plant(stage(s), h.color)}</svg></div>
        <div class="info">
          <h2>${esc(h.name)}</h2>
          <p class="meta">${stageName[stage(s)]} · ${s}-day streak</p>
          <div class="row">
            <button class="water" data-water="${h.id}" aria-pressed="${done}">${done ? 'Watered' : 'Water today'}</button>
            <button class="del" data-del="${h.id}" aria-label="Remove ${esc(h.name)}">Remove</button>
          </div>
        </div></article>`;
    }).join('');
  }

  garden.addEventListener('click', e => {
    const w = e.target.closest('[data-water]'), d = e.target.closest('[data-del]');
    if (w) {
      const h = habits.find(x => x.id == w.dataset.water), t = today();
      h.days = h.days.includes(t) ? h.days.filter(x => x !== t) : [...h.days, t];
      save(); render(h.id);
    } else if (d) {
      habits = habits.filter(x => x.id != d.dataset.del);
      save(); render();
    }
  });

  $('#add').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#name').value.trim();
    if (!name) return;
    habits.unshift({ id: Date.now(), name, color: document.querySelector('input[name=c]:checked').value, days: [] });
    e.target.reset(); save(); render();
  });

  document.querySelector('.filters').addEventListener('click', e => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    filter = b.dataset.f;
    document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    render();
  });

  const root = document.documentElement, themeBtn = $('#theme');
  const setTheme = t => { root.dataset.theme = t; themeBtn.textContent = t === 'dark' ? 'Day' : 'Night'; try { localStorage.setItem('sprout-theme', t); } catch {} };
  let saved = null; try { saved = localStorage.getItem('sprout-theme'); } catch {}
  setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  render();
})();
