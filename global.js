// console.log("IT'S ALIVE!");

// // Add navigation menu dynamically (from Step 3)
// const pages = [
//   { url: '', title: 'Home' },
//   { url: 'projects/', title: 'Projects' },
//   { url: 'contact/', title: 'Contact' },
//   { url: 'https://github.com/tommycho1223/', title: 'My GitHub' },
//   { url: 'cv/', title: 'Resume' },
// ];

// const nav = document.createElement('nav');
// document.body.prepend(nav);

// const ARE_WE_HOME = document.documentElement.classList.contains('home');

// for (const p of pages) {
//   let url = p.url;
//   if (!ARE_WE_HOME && !url.startsWith('http')) url = '../' + url;

//   const a = document.createElement('a');
//   a.href = url;
//   a.textContent = p.title;

//   if (a.host === location.host && a.pathname === location.pathname) {
//     a.classList.add('current');
//   }

//   if (a.host !== location.host) {
//     a.target = '_blank';
//   }

//   nav.append(a);
// }

// // Add theme switch dropdown dynamically
// document.body.insertAdjacentHTML(
//   'afterbegin',
//   `
//   <label class="color-scheme">
//       Theme:
//       <select id="theme-switch">
//           <option value="light dark">Automatic</option>
//           <option value="light">Light</option>
//           <option value="dark">Dark</option>
//       </select>
//   </label>
//   `
// );

// // Reference to the theme switcher dropdown
// const themeSwitcher = document.querySelector('#theme-switch');

// // Default to dark mode if no preference is set
// if (savedScheme) {
//     document.documentElement.style.setProperty('color-scheme', savedScheme);
// } else {
//     document.documentElement.style.setProperty('color-scheme', 'dark');
//     localStorage.colorScheme = 'dark'; // Save default preference
// }
  
// // Update the select dropdown to match the current scheme
// const select = document.querySelector('select');
// if (select) {
//     select.value = savedScheme || 'dark';
// }

// // Attach event listener to handle theme changes
// themeSwitcher.addEventListener('input', (event) => {
//   const selectedTheme = event.target.value;
//   console.log('Color scheme changed to', selectedTheme);

//   // Apply the selected theme to the root element
//   document.documentElement.style.setProperty('color-scheme', selectedTheme);

//   // Save the selected theme to localStorage
//   localStorage.colorScheme = selectedTheme;
// });

// Step 1: Debugging and utility function
console.log('IT’S ALIVE!'); // For debugging to confirm the script is running

// Utility function to select multiple elements
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Step 1: Highlight the current page link
const navLinks = $$('.menu a'); // Use the $$ function for selecting links
const currentLink = navLinks.find(link =>
  link.host === location.host && link.pathname === location.pathname
);

if (currentLink) {
  currentLink.classList.add('current');
}

// Step 3: Create the navigation menu dynamically
const pages = [
  { url: "/", title: "Home" },
  { url: "/projects/", title: "Projects" },
  { url: "/contact/", title: "Contact" },
  { url: "https://github.com/yourgithubprofile", title: "My GitHub" },
  { url: "/cv/", title: "Resume" }
];

const nav = document.createElement('nav');
document.body.prepend(nav);

pages.forEach(page => {
  const a = document.createElement('a');
  a.href = page.url;
  a.textContent = page.title;

  // Highlight the current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  // Open external links in a new tab
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.appendChild(a);
});

// Step 4.2: Add the color scheme switcher dynamically
document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="color-scheme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

// Step 4.3: Handle color scheme logic
const select = document.querySelector('#color-scheme-select');
const root = document.documentElement;

// Step 4.4: Check for saved color scheme or default to dark mode
const savedScheme = localStorage.getItem('colorScheme');
if (savedScheme) {
  root.style.setProperty('color-scheme', savedScheme);
  select.value = savedScheme;
} else {
  root.style.setProperty('color-scheme', 'dark'); // Default to dark mode
  localStorage.setItem('colorScheme', 'dark');
  select.value = 'dark';
}

// Step 4.5: Add event listener to switch themes
select.addEventListener('input', (event) => {
  const scheme = event.target.value;
  root.style.setProperty('color-scheme', scheme);
  localStorage.setItem('colorScheme', scheme);
});
