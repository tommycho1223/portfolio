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

// Data for the pie chart (two slices: 1 and 2)
let data = [1, 2];

// Compute total sum
let total = data.reduce((sum, d) => sum + d, 0);

// Calculate start and end angles
let angle = 0;
let arcData = [];

for (let d of data) {
    let endAngle = angle + (d / total) * 2 * Math.PI;
    arcData.push({ startAngle: angle, endAngle });
    angle = endAngle;
}

// Create an arc generator
let pieArcGenerator = d3.arc()
    .innerRadius(0)  // Full pie (0 for full pie, >0 for donut chart)
    .outerRadius(50); // Pie radius

// Generate paths for slices
let arcs = arcData.map(d => pieArcGenerator(d));

// Define colors for slices
let colors = ['gold', 'purple'];

// Select the existing SVG and append slices
d3.select("#projects-pie-plot")
  .selectAll("path")
  .data(arcs)
  .enter()
  .append("path")
  .attr("d", d => d)
  .attr("fill", (_, i) => colors[i]); // Assigns color