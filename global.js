console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Insert the color scheme switch at the top of the body
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
// const navLinks = $$("nav a"); // Get all navigation links
// console.log(navLinks); // Debugging: Check if we got the correct links

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );

console.log(currentLink); // Debugging: Check if we found the correct link

if (currentLink) {
    currentLink.classList.add("current");
}

// OR, using optional chaining (shorter version):
currentLink?.classList.add("current");

// Define the pages and their URLs
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'cv/', title: 'Resume' },
    { url: 'https://github.com/tommycho1223', title: 'GitHub' }
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
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    // Create <a> element manually instead of using innerHTML
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    // Highlight the current page
    a.classList.toggle("current", a.host === location.host && a.pathname === location.pathname);

    // Open external links (GitHub) in a new tab
    if (a.host !== location.host) {
        a.target = "_blank";
    }

    // Append link to navigation
    nav.append(a);
}

// Get the theme switcher dropdown
const themeSwitch = document.getElementById("theme-switch");

// Function to set the theme
function setTheme(mode) {
    if (mode === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", mode);
    }
    localStorage.setItem("theme", mode); // Save user preference
}

// Apply stored theme on page load
const savedTheme = localStorage.getItem("theme") || "auto";
themeSwitch.value = savedTheme;
setTheme(savedTheme);

// Change theme on user selection
themeSwitch.addEventListener("change", (event) => {
    setTheme(event.target.value);
});