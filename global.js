console.log("IT'S ALIVE!");

// Add navigation menu dynamically (from Step 3)
const pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/tommycho1223/', title: 'My GitHub' },
  { url: 'cv/', title: 'Resume' },
];

const nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (const p of pages) {
  let url = p.url;
  if (!ARE_WE_HOME && !url.startsWith('http')) url = '../' + url;

  const a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;

  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

// Add theme switch dropdown dynamically
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
      Theme:
      <select id="theme-switch">
          <option value="light dark">Automatic</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
      </select>
  </label>
  `
);

// Reference to the theme switcher dropdown
const themeSwitcher = document.querySelector('#theme-switch');

// On page load, check localStorage for a saved theme
const savedTheme = localStorage.colorScheme;
if (savedTheme) {
  document.documentElement.style.setProperty('color-scheme', savedTheme);
  themeSwitcher.value = savedTheme;
}

// Attach event listener to handle theme changes
themeSwitcher.addEventListener('input', (event) => {
  const selectedTheme = event.target.value;
  console.log('Color scheme changed to', selectedTheme);

  // Apply the selected theme to the root element
  document.documentElement.style.setProperty('color-scheme', selectedTheme);

  // Save the selected theme to localStorage
  localStorage.colorScheme = selectedTheme;
});