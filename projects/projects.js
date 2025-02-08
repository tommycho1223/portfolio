import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = []; // Global variable to store projects

async function loadProjects() {
    try {
        projects = await fetchJSON('./projects.json'); // Ensure correct path
        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
        renderPieChart(projects); // Restore pie chart rendering

        // Ensure search is working properly
        let searchInput = document.querySelector('.searchBar');
        searchInput.addEventListener('input', (event) => {
            let query = event.target.value.toLowerCase();
            let filteredProjects = projects.filter(project => {
                let values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query);
            });

            renderProjects(filteredProjects, projectsContainer, 'h2');
            renderPieChart(filteredProjects); // Keep chart updated
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Restore `renderPieChart()` from Step 5.1
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

    // Restore legend update
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
