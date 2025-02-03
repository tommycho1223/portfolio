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

    // To open "My GitHub" in a new tab
    if (url.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }

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

function updateAutomaticLabel() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const autoOption = themeSwitch.querySelector("option[value='auto']");
    autoOption.textContent = `Automatic (${isDarkMode ? "Dark" : "Light"})`;
}

function setTheme(mode) {
    if (mode === "auto") {
        const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    } else {
        document.documentElement.setAttribute("data-theme", mode);
    }

    localStorage.setItem("colorScheme", mode);
    updateAutomaticLabel();  // Update the dropdown text
}

// Apply stored theme on page load
const savedTheme = localStorage.getItem("colorScheme") || "auto";
themeSwitch.value = savedTheme;
setTheme(savedTheme);

// Update theme when the user changes it
themeSwitch.addEventListener("input", (event) => {
    setTheme(event.target.value);
});

// Listen for OS theme changes and update accordingly
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (localStorage.getItem("colorScheme") === "auto") {
        setTheme("auto");
    }
});

export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        // Parse the response JSON
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, container, headingTag = 'h2') {
    if (!container) {
        console.error("Error: Projects container not found.");
        return;
    }

    container.innerHTML = ''; // Clear existing content

    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects available.</p>';
        return;
    }

    // Validate headingTag to ensure it's a valid heading tag
    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingTag)) {
        console.warn(`Invalid heading level: ${headingTag}. Defaulting to h2.`);
        headingTag = 'h2';
    }

    // Create project elements
    projects.forEach(project => {
        const article = document.createElement('article');

        const title = document.createElement(headingTag);
        title.textContent = project.title;

        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;

        const description = document.createElement('p');
        description.textContent = project.description;

        // Add year to each project
        const year = document.createElement('p');
        year.classList.add('project-year');
        year.textContent = `© ${project.year}`;

        article.appendChild(title);
        article.appendChild(img);
        article.appendChild(description);
        article.appendChild(year);

        // Append article to container
        container.appendChild(article);
    });
}

export async function fetchGitHubData(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        return await response.json(); // Convert response to JSON
    } catch (error) {
        console.error("Error fetching GitHub profile:", error);
        return null;  // Return null if fetch fails
    }
}