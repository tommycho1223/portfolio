import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let projects = []; // Store all projects
let selectedYear = null; // Track selected year

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        const projectsContainer = document.querySelector('.projects');
        const searchInput = document.querySelector('.searchBar');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
        renderPieChart(projects); // Initial render

        // Add search event listener
        searchInput.addEventListener('input', (event) => {
            let query = event.target.value.toLowerCase();
            let filteredProjects = projects.filter(project => {
                let values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query);
            });

            renderProjects(filteredProjects, projectsContainer, 'h2');
            renderPieChart(filteredProjects); // Re-render pie chart
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// function renderProjectPieChart(projects) {
//     let rolledData = d3.rollups(
//         projects,
//         v => v.length,  // Count projects per year
//         d => d.year      // Group by year
//     );

//     let data = rolledData.map(([year, count]) => ({
//         value: count,
//         label: year
//     }));

//     console.log("Pie Chart Data:", data); // Debugging

//     if (data.length > 0) {
//         console.log("Rendering Pie Chart...");
//         renderPieChart(data);
//     } else {
//         console.error("No valid data for pie chart.");
//     }
// }

function renderPieChart(data) {
    let rolledData = d3.rollups(
        projectsGiven,
        v => v.length,  // Count projects per year
        d => d.year      // Group by year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    let svgContainer = d3.select("#projects-pie-plot");

    // Clear previous chart before re-rendering
    svgContainer.selectAll("*").remove();

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
       .data(pie(data))
       .enter()
       .append('path')
       .attr('d', arc)
       .attr('fill', (d, i) => color(i))
       .attr('stroke', 'white')
       .style('stroke-width', '2px')
       .style('cursor', 'pointer')
       .on('click', function(event, d) {
           selectedYear = d.data.label; // Set selected year
           let filteredProjects = projects.filter(project => project.year === selectedYear);
           renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
           renderPieChart(filteredProjects); // Update chart based on selection
       });

    // Update legend
    let legend = d3.select('.legend');
    legend.selectAll("*").remove();

    legend.selectAll('li')
          .data(data)
          .enter()
          .append('li')
          .style('color', (d, i) => color(i))
          .html(d => `<span class="swatch"></span> ${d.label} (${d.value})`)
          .style('cursor', 'pointer')
          .on('click', function(event, d) {
              selectedYear = d.label;
              let filteredProjects = projects.filter(project => project.year === selectedYear);
              renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
              renderPieChart(filteredProjects); // Update chart
          });
}

// Call function to load all projects
loadProjects();
