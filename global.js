console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a"); // Get all navigation links
console.log(navLinks); // Debugging: Check if we got the correct links

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);

console.log(currentLink); // Debugging: Check if we found the correct link
