console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("nav a");
console.log(navLinks);

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);
  
console.log(currentLink);

if (currentLink) {
    // or if (currentLink !== undefined)
    currentLink.classList.add('current');
}

let pages = [
    { url: 'https://tommycho1223.github.io/portfolio/index.html', title: 'Home' },
    { url: 'https://tommycho1223.github.io/portfolio/projects/index.html', title: 'Projects' },
    { url: 'https://tommycho1223.github.io/portfolio/contact/index.html', title: 'Contact' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
    { url: 'https://tommycho1223.github.io/portfolio/cv/index.html', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
    `
  );

  const savedTheme = localStorage.getItem('theme') || 'light dark';
  document.documentElement.style.colorScheme = savedTheme;
  document.getElementById('theme-selector').value = savedTheme;
  
  // Listen for changes in the dropdown
  const themeSelector = document.getElementById('theme-selector');
  themeSelector.addEventListener('change', (event) => {
    const selectedTheme = event.target.value; // Get the selected value
    document.documentElement.style.colorScheme = selectedTheme; // Update the color-scheme property
    localStorage.setItem('theme', selectedTheme); // Save the preference
  });