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

// Function to render the pie chart
function renderPieChart(data) {
    let rolledData = d3.rollups(
        data,
        v => v.length,
        d => d.year
    );

    let pieData = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

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

    let color = d3.scaleOrdinal(d3.schemeTableau10);
    let pie = d3.pie().value(d => d.value);
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    let arcs = svg.selectAll('path')
       .data(pie(pieData))
       .enter()
       .append('path')
       .attr('d', arc)
       .attr('fill', (d, i) => color(i))
       .attr('stroke', 'white')
       .style('stroke-width', '2px');

    // Update legend
    let legend = d3.select('.legend');
    legend.selectAll("*").remove();

    legend.selectAll('li')
          .data(pieData)
          .enter()
          .append('li')
          .style('color', (d, i) => color(i))
          .html(d => `<span class="swatch"></span> ${d.label} (${d.value})`);
}

// Ensure projects load correctly
loadProjects();
