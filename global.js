console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let navLinks = $$("ul a");
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
    { url: 'https://tommycho1223.github.io/portfolio/index.html', title: 'Home' },
    { url: 'https://tommycho1223.github.io/portfolio/projects/index.html', title: 'Projects' },
    { url: 'https://tommycho1223.github.io/portfolio/contact/index.html', title: 'Contact' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' },
    { url: 'https://tommycho1223.github.io/portfolio/cv/index.html', title: 'Resume' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;

    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        a.target = '_blank';
    }

    nav.append(a);
}

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

  let select = document.querySelector('.color-scheme select');

  select.addEventListener('input', function (event) {
    console.log('Color scheme changed to', event.target.value);

    localStorage.colorScheme = event.target.value;

    document.documentElement.style.setProperty('color-scheme', event.target.value);
});

if ('colorScheme' in localStorage) {
    let savedScheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', savedScheme);

    select.value = savedScheme;
}