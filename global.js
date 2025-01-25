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
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
    { url: 'cv/', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  }

  const ARE_WE_HOME = document.documentElement.classList.contains('home');

  for (let p of pages) {
    let url = p.url;
    let title = p.title;
  
    if (!ARE_WE_HOME && !url.startsWith('http')) {
      url = '../' + url;
    }
  
    nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
  }
  