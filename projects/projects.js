import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = ''; // Store search input

// Select the search bar
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
    filterProjects();
});

function filterProjects() {
    fetchJSON('../lib/projects.json').then((projects) => {
        // Filter projects based on search query
        let filteredProjects = projects.filter((project) => {
            let values = Object.values(project).join('\n').toLowerCase();
            return values.includes(query.toLowerCase());
        });

        // Update the project count
        const projectsTitle = document.querySelector('.projects-title');
        if (projectsTitle) {
            projectsTitle.textContent = `${filteredProjects.length} Projects`;
        }

        // Update project list (REQUIRED)
        const projectsContainer = document.querySelector('.projects');
        projectsContainer.innerHTML = ""; // Clear previous projects
        renderProjects(filteredProjects, projectsContainer, 'h2');

        // Update Pie Chart based on filtered projects
        let rolledData = d3.rollups(
            filteredProjects,
            (v) => v.length,
            (d) => d.year
        );

        let data = rolledData.map(([year, count]) => ({
            value: count,
            label: year,
        }));

        renderPieChart(data); // Update pie chart dynamically
    }).catch((error) => console.error("Error filtering projects:", error));
}

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

        renderProjects(projects, projectsContainer, 'h2');

        // Group projects by year
        let rolledData = d3.rollups(
            projects,
            (v) => v.length,  // Count projects per year
            (d) => d.year      // Group by year
        );

        // Convert to correct format
        let data = rolledData.map(([year, count]) => ({
            value: count,
            label: year
        }));

        console.log("Processed Pie Chart Data:", data); // Debugging

        // Ensure small pie chart updates dynamically
        renderPieChart(data);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call function
loadProjects();

function renderPieChart(data) {
    let container = document.getElementById("projects-pie-plot");
    let width = container.clientWidth || 250; // Get container width
    let height = width; // Maintain aspect ratio
    let radius = Math.min(width, height) / 2 - 10;

    // Clear existing pie chart before redrawing
    d3.select("#projects-pie-plot").selectAll("*").remove();

    let svg = d3.select("#projects-pie-plot")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

    let color = d3.scaleOrdinal(d3.schemeTableau10);

    let pie = d3.pie().value(d => d.value);
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('path')
       .data(pie(data))
       .enter()
       .append('path')
       .attr('d', arc)
       .attr('fill', (d, i) => color(i))
       .attr('stroke', 'white')
       .style('stroke-width', '2px');

    // Adjust the legend placement and spacing
    let legendContainer = d3.select('.legend');
    legendContainer.selectAll("*").remove(); 

    legendContainer.style("display", "grid")
                  .style("grid-template-columns", "repeat(auto-fill, minmax(90px, 1fr))")
                  .style("gap", "8px")
                  .style("margin-top", "10px");

    legendContainer.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px')
        .html((d, i) => 
            `<span class="swatch" style="width: 12px; height: 12px; display: inline-block; background-color: ${color(i)};"></span> 
             ${d.label} <em>(${d.value})</em>`
        );
}

// Resize Pie Chart on Window Resize
window.addEventListener("resize", () => {
    let container = document.getElementById("projects-pie-plot");
    let width = container.clientWidth || 250;
    let height = width;
    renderPieChart(data);
});
