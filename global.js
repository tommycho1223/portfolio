console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https:///github.com/tommycho1223/', title: 'My GitHub' },
    { url: 'cv/', title: 'Resume' },
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let nav = document.createElement('nav');
nav.classList.add('menu'); // Optional: Add a class for styling
document.body.prepend(nav); // Add the navigation menu at the top of the <body>

for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    // Adjust the URL if not on the home page
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  
    // Add links to the <nav>
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

const navLinks = $$("nav a");
// console.log(navLinks);

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);
  
// console.log(currentLink);

if (currentLink) {
    currentLink.classList.add('current');
}



  