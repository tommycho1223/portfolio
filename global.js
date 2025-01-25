console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Define pages for navigation
const pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
    { url: 'cv/', title: 'Resume' }
];

// Create the navigation menu
const nav = document.createElement('nav');
document.body.prepend(nav);

// Check if we're on the home page
const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Generate navigation links
for (let p of pages) {
    let a = document.createElement('a'); // Create an anchor element
    let url = p.url;
    let title = p.title;

    // Adjust relative URLs if not on the home page and the URL is not absolute
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    // Set attributes for the link
    a.href = url;
    a.textContent = title;

    // Highlight the current page
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    // Open external links in a new tab
    if (a.host !== location.host) {
        a.target = '_blank';
    }

    // Append the link to the navigation menu
    nav.append(a);
}

// Add theme switch dropdown
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

