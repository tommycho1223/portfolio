console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Insert the color scheme switch at the top of the body (to the right)
document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
        Theme:
        <select id="theme-switch">
            <option value="auto">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>
    `
);

// Define the pages and their URLs
let pages = [
    { url: 'portfolio/', title: 'Home' },
    { url: 'portfolio/projects/', title: 'Projects' },
    { url: 'portfolio/contact/', title: 'Contact' },
    { url: 'portfolio/cv/', title: 'Resume' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' }
];

// Create <nav> element and add it to the beginning of <body>
let nav = document.createElement('nav');
document.body.prepend(nav);

// Detect if we are on the homepage
const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Generate links and append to <nav>
for (let p of pages) {
    let url = p.url;
    let title = p.title;

    // Adjust URLs for pages that are not on the home page
    const BASE_PATH = '/portfolio/';
    url = !ARE_WE_HOME && !url.startsWith('http') ? BASE_PATH + url.replace(/^portfolio\//, '') : url;
    
    // Create <a> element manually instead of using innerHTML
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // Append link to navigation
    nav.append(a);
}

// Get all navigation links
const navLinks = $$("nav a");

// Find the current page link
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);

// Debugging check
console.log(currentLink);

// Highlight the current page link
currentLink?.classList.add("current");

// Get the theme switcher dropdown
const themeSwitch = document.getElementById("theme-switch");

// Function to set and save the theme
function setTheme(mode) {
    if (mode === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", mode);
    }

    // Save user preference in localStorage
    localStorage.setItem("colorScheme", mode);
}

// Apply stored theme on page load
const savedTheme = localStorage.getItem("colorScheme") || "auto";
themeSwitch.value = savedTheme;
setTheme(savedTheme);

// Change theme on user selection
themeSwitch.addEventListener("input", (event) => {
    setTheme(event.target.value);
});