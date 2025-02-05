import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        console.log("Fetched projects:", projects); // Debugging line

        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        // Update the heading with the number of projects
        if (projectsTitle) {
            projectsTitle.textContent = `${projects.length} Projects`;
        }

        renderProjects(projects, projectsContainer, 'h2'); // Calls the updated render function
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call function
loadProjects();

// Define the arc generator
let arcGenerator = d3.arc()
    .innerRadius(0)  // Creates a full circle (0 for filled, >0 for a donut chart)
    .outerRadius(50); // Radius of 50

// Generate the arc path data
let arc = arcGenerator({
    startAngle: 0,        // Start angle (0 radians)
    endAngle: 2 * Math.PI // End angle (full circle, 2π radians)
});

// Append the generated path to the existing SVG
document.addEventListener("DOMContentLoaded", () => {
    d3.select("#projects-pie-plot")
      .append("path")
      .attr("d", arc)
      .attr("fill", "red");
});