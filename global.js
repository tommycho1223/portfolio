console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

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

    // Add the link to <nav>
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

// Automatically highlight the current page
let navLinks = $$("nav a"); // Get all navigation links
let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);
currentLink?.classList.add("current");
