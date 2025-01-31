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

// Define the pages and their URLs
let pages = [
    { url: '/portfolio/', title: 'Home' },
    { url: '/portfolio/projects/', title: 'Projects' },
    { url: '/portfolio/contact/', title: 'Contact' },
    { url: '/portfolio/cv/', title: 'Resume' },
    { url: 'https://github.com/tommycho1223', title: 'My GitHub' }
];

// Create <nav> element and add it to the beginning of <body>
let nav = document.createElement('nav');
document.body.prepend(nav);

// Generate links and append to <nav>
for (let p of pages) {
    let a = document.createElement('a');
    a.href = p.url;
    a.textContent = p.title;

    // Highlight the current page
    if (window.location.pathname === p.url) {
        a.classList.add("current");
    }

    // Open GitHub in a new tab
    if (p.url.startsWith("http")) {
        a.target = "_blank";
    }

    nav.appendChild(a);
}

// Log navigation links to debug
console.log($$("nav a")); // Debugging: Check if we got the correct links

// Get the theme switcher dropdown
const themeSwitch = document.getElementById("theme-switch");

// Function to set and save the theme
function setTheme(mode) {
    if (mode === "auto") {
        document.documentElement.removeAttribute("data-theme");
    } else {
        document.documentElement.setAttribute("data-theme", mode);
    }
    localStorage.setItem("colorScheme", mode);
}

// Apply stored theme on page load
const savedTheme = localStorage.getItem("colorScheme") || "auto";
if (themeSwitch) {
    themeSwitch.value = savedTheme;
    setTheme(savedTheme);

    // Change theme on user selection
    themeSwitch.addEventListener("input", (event) => {
        setTheme(event.target.value);
    });
}

// Get the contact form
const form = document.getElementById("contact-form");

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default submission

        // Get form values
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const body = document.getElementById("body").value;

        // Encode values properly
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open mail client with pre-filled fields
        window.location.href = mailtoLink;
    });
}
