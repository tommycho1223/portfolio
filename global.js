// Step 1: Logging and utility function
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2: Highlighting the current page
const navLinks = $$('nav a');
const currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
currentLink?.classList.add('current');

// Step 3: Automatic navigation menu
const pages = [
  { url: '/', title: 'Home' },
  { url: '/projects/', title: 'Projects' },
  { url: '/contact/', title: 'Contact' },
  { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
  { url: '/cv/', title: 'Resume' }
];

const nav = document.createElement('nav');
document.body.prepend(nav);

for (let page of pages) {
  const a = document.createElement('a');
  a.href = page.url;
  a.textContent = page.title;

  // Highlight current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  // Open external links in a new tab
  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

// Step 4.1: Enable dark mode support using CSS
document.documentElement.style.setProperty('color-scheme', 'light dark');

// Step 4.2: Adding theme switcher
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic (Dark)</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

// Step 4.3: Theme switcher positioning
const themeSwitcher = document.querySelector('.color-scheme');
const select = themeSwitcher.querySelector('select');

// Step 4.4: Make theme switcher functional
select.addEventListener('input', event => {
  const theme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.colorScheme = theme; // Save user preference
});

// Step 4.5: Load saved theme preference on page load
const savedTheme = localStorage.colorScheme;
if (savedTheme) {
  document.documentElement.style.setProperty('color-scheme', savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
  select.value = savedTheme; // Update the dropdown value
} else {
  // Default to Automatic (light dark)
  document.documentElement.setAttribute('data-theme', 'light dark');
  select.value = 'light dark';
}
