import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = []; // Global variable to store projects

async function loadProjects() {
    try {
        projects = await fetchJSON('./projects.json');
        console.log("Fetched Projects:", projects); // Debugging

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Error: No container found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
        renderPieChart(projects); // Ensure pie chart loads initially

    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

// Function to draw a dynamic pie chart with more slices
function renderPieChart(data) {
    let svgContainer = d3.select("#projects-pie-plot");
    svgContainer.selectAll("*").remove(); // Clear before re-rendering

    let width = 300;
    let height = 300;
    let radius = Math.min(width, height) / 2 - 10;

    let svg = svgContainer
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

    let dataValues = [1, 2, 3, 4, 5, 5]; // More data for multiple slices
    let pie = d3.pie()(dataValues);
    
    let arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);
    
    let colors = d3.scaleOrdinal(d3.schemeTableau10); // Generate colors dynamically
    
    pie.forEach((d, idx) => {
        svg.append("path")
            .attr("d", arcGenerator(d))
            .attr("fill", colors(idx))
            .attr("stroke", "white")
            .style("stroke-width", "2px");
    });
}

// Ensure projects load correctly
loadProjects();
