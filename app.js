const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const header = document.querySelector('[data-header]');

menuToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach((link) => link.addEventListener('click', () => {
  siteNav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelector('[data-year]')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const projectList = document.querySelector('.project-list');
if (projectList) {
  const rows = [...projectList.querySelectorAll('.project-row')];
  const filterBar = document.createElement('div');
  filterBar.className = 'project-filters';
  filterBar.setAttribute('aria-label', 'Filter projects');

  const categoryMap = {
    'All': () => true,
    'Agentic AI': (type) => /Agentic AI/i.test(type),
    'Machine Learning': (type) => /Machine Learning|Deep Learning|Computer Vision|Forecasting/i.test(type),
    'NLP': (type) => /NLP/i.test(type),
    'AI & Algorithms': (type) => /AI Algorithms|Data Structures|Algorithms/i.test(type)
  };

  Object.keys(categoryMap).forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `filter-button${index === 0 ? ' is-active' : ''}`;
    button.textContent = label;
    button.dataset.filter = label;
    button.setAttribute('aria-pressed', String(index === 0));
    filterBar.appendChild(button);
  });

  projectList.before(filterBar);
  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const predicate = categoryMap[button.dataset.filter] ?? categoryMap.All;
    filterBar.querySelectorAll('button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    rows.forEach((row) => {
      const type = row.querySelector('.project-type')?.textContent.trim() ?? '';
      row.hidden = !predicate(type);
    });
  });
}

const themeButton = document.createElement('button');
themeButton.type = 'button';
themeButton.className = 'theme-toggle';
themeButton.setAttribute('aria-label', 'Toggle dark mode');
themeButton.textContent = '◐';
header?.querySelector('.nav-wrap')?.appendChild(themeButton);
if (localStorage.getItem('portfolio-theme') === 'dark') document.documentElement.dataset.theme = 'dark';
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light');
});

fetch('https://api.github.com/users/PriyankaGhawghawe', { headers: { Accept: 'application/vnd.github+json' } })
  .then((response) => response.ok ? response.json() : null)
  .then((profile) => {
    if (!profile) return;
    const metric = document.createElement('span');
    metric.className = 'github-metric';
    metric.textContent = `${profile.public_repos ?? 0} public repositories · ${profile.followers ?? 0} followers`;
    document.querySelector('.footer-wrap')?.appendChild(metric);
  }).catch(() => {});

const structuredData = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Priyanka Ghawghawe',
  url: 'https://priyankaghawghawe.github.io/', email: 'mailto:priyankamenghare09@gmail.com',
  sameAs: ['https://www.linkedin.com/in/priyankaghawghawe/', 'https://github.com/PriyankaGhawghawe'],
  jobTitle: 'Full Stack Software Developer | Data & AI Professional',
  knowsAbout: ['Angular', '.NET', 'C#', 'Node.js', 'SQL', 'Machine Learning', 'Deep Learning', 'NLP', 'Big Data', 'PySpark']
};
const jsonLd = document.createElement('script');
jsonLd.type = 'application/ld+json';
jsonLd.textContent = JSON.stringify(structuredData);
document.head.appendChild(jsonLd);
