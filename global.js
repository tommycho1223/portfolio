console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");
console.log(navLinks);

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
  );
  
  console.log(currentLink);

  if (currentLink) {
    // or if (currentLink !== undefined)
    currentLink.classList.add('current');
  }