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

// === PIE CHART CODE ===

// Data for the pie chart (with labels)
let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
];

// Generate pie slice angles using D3
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data); // Generate slices automatically

// Create an arc generator
let pieArcGenerator = d3.arc()
    .innerRadius(0)  // Full pie (0 for full pie, >0 for donut chart)
    .outerRadius(50); // Pie radius

// Define colors for slices
let colors = d3.scaleOrdinal(d3.schemeTableau10);

// Select the existing SVG and append slices
d3.select("#projects-pie-plot")
  .selectAll("path")
  .data(arcData) // ✅ Use arcData directly
  .enter()
  .append("path")
  .attr("d", d => pieArcGenerator(d)) // ✅ Generate arc paths here
  .attr("fill", (_, i) => colors(i)); // Assign colors dynamically

let legend = d3.select(".legend"); // Select the legend <ul>

data.forEach((d, idx) => {
    legend.append("li")
        .attr("style", `--color:${colors(idx)}`) // Assigns the slice's color
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // Adds label and value
});
