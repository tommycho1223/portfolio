// Step 1
console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 2
const navLinks = $$('nav a');
const currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
currentLink?.classList.add('current');

// Step 3
const pages = [
  { url: 'https://tommycho1223.github.io/portfolio/', title: 'Home' },
  { url: 'https://tommycho1223.github.io/portfolio/projects/', title: 'Projects' },
  { url: 'https://tommycho1223.github.io/portfolio/contact/', title: 'Contact' },
  { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
  { url: 'https://tommycho1223.github.io/portfolio/cv/', title: 'Resume' }
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

// Step 4.1
document.documentElement.style.setProperty('color-scheme', 'light dark');

// Step 4.2
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

// Step 4.3
const themeSwitcher = document.querySelector('.color-scheme');
const select = themeSwitcher.querySelector('select');

// Step 4.4
select.addEventListener('input', event => {
  const theme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.colorScheme = theme; // Save user preference
});

// Step 4.5
const savedTheme = localStorage.colorScheme;

if (savedTheme) {
  document.documentElement.style.setProperty('color-scheme', savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
  select.value = savedTheme;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // Default to Automatic Dark Mode
  document.documentElement.style.setProperty('color-scheme', 'dark');
  document.documentElement.setAttribute('data-theme', 'dark'); // Change to "dark"
  select.value = 'light dark';
} else {
  // Default to Automatic Light Mode
  document.documentElement.style.setProperty('color-scheme', 'light');
  document.documentElement.setAttribute('data-theme', 'light');
  select.value = 'light dark';
}

// Step 5
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);
    const mailto = form.action; // The mailto address from the form's action attribute
    const url = new URL(mailto);

    // Loop through the form data and append as query parameters
    for (let [name, value] of formData) {
      url.searchParams.append(name, encodeURIComponent(value));
    }

    // Open the mailto link with the built URL
    location.href = url.href;
  });
}

export async function fetchJSON(url) {
  try {
    const response = await fetch('https://tommycho1223.github.io/portfolio/lib/projects.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

async function loadProjects() {
  const projectsContainer = document.querySelector('.projects');
  if (!projectsContainer) {
    console.error('Error: .projects container not found in the HTML.');
    return;
  }

  const projects = await fetchJSON('https://tommycho1223.github.io/portfolio/lib/projects.json');

  if (!projects || projects.length === 0) {
    console.error('Error: No projects were loaded.');
    return;
  }

  projectsContainer.innerHTML = ''; // Clear existing content

  // Use renderProjects() instead of manually creating elements
  projects.forEach(project => {
    renderProjects(project, projectsContainer, 'h2'); 
  });
  console.log('Projects successfully added to the page.');
}

// Run this function when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  // Ensure the container exists
  if (!containerElement) {
    console.error('Error: containerElement is null or undefined.');
    return;
  }

  // Clear existing content to avoid duplication
  containerElement.innerHTML = '';

  // Create an <article> element
  const article = document.createElement('article');

  // Validate heading level (default to h2 if invalid)
  const validHeadingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadingTags.includes(headingLevel)) {
    console.warn(`Invalid headingLevel "${headingLevel}". Using "h2" instead.`);
    headingLevel = 'h2';
  }

  // Set article content dynamically
  article.innerHTML = `
    <${headingLevel}>${project.title}</${headingLevel}>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>
  `;

  // Append the article to the container
  containerElement.appendChild(article);
}
