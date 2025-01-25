// Log a message to the console to verify the script is working
console.log("IT'S ALIVE!");

// Helper function to select multiple elements
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Highlight the current page in the navigation
const currentPage = window.location.pathname; // Get the current page's pathname
const navLinks = $$("nav a"); // Get all navigation links

// Find the link corresponding to the current page
const currentLink = navLinks.find((link) => link.href.includes(currentPage));

// Add the 'current' class safely
currentLink?.classList.add("current");

// Set dynamic page title
const pageTitles = {
    "/": "Home",
    "/projects/": "Projects",
    "/contact/": "Contact",
    "/cv/": "Resume",
};

const currentPath = window.location.pathname;
const newTitle = pageTitles[currentPath] || "Portfolio";

document.title = `Tommy Li: ${newTitle}`;



// let pages = [
//     { url: '', title: 'Home' },
//     { url: 'projects/', title: 'Projects' },
//     { url: 'contact/', title: 'Contact' },
//     { url: 'https:///github.com/tommycho1223/', title: 'My GitHub' },
//     { url: 'cv/', title: 'Resume' },
// ];

// const ARE_WE_HOME = document.documentElement.classList.contains('home');

// let nav = document.createElement('nav');
// nav.classList.add('menu'); // Optional: Add a class for styling
// document.body.prepend(nav); // Add the navigation menu at the top of the <body>

// for (let p of pages) {
//     let url = p.url;
//     let title = p.title;
  
//     // Adjust the URL if not on the home page
//     url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  
//     // Add links to the <nav>
//     nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
// }

// const navLinks = $$("nav a");
// // console.log(navLinks);

// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
// );
  
// // console.log(currentLink);

// if (currentLink) {
//     currentLink.classList.add('current');
// }