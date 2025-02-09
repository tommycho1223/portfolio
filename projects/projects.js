import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = ''; // Store search input
let allProjects = []; // Store fetched projects

// Select the search bar
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase(); // Convert query to lowercase for case-insensitive search
    filterProjects(); // Call filter function when input changes
});

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');
        allProjects = projects; // Store all projects

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
        renderPieChart(projects); // Initialize pie chart

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function filterProjects() {
    let filteredProjects = allProjects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });

    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');

    if (projectsTitle) {
        projectsTitle.textContent = `${filteredProjects.length} Projects`;
    }

    projectsContainer.innerHTML = ""; // Clear previous projects
    renderProjects(filteredProjects, projectsContainer, 'h2'); // Update project list
    renderPieChart(filteredProjects); // Update pie chart dynamically
}

function renderPieChart(data) {
    let container = document.getElementById("projects-pie-plot");
    let width = container.clientWidth || 250; // Responsive width
    let height = width; 
    let radius = Math.min(width, height) / 2 - 10;

    // Clear previous pie chart
    d3.select("#projects-pie-plot").selectAll("*").remove();

    let svg = d3.select("#projects-pie-plot")
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

    let color = d3.scaleOrdinal(d3.schemeTableau10);

    let pie = d3.pie().value(d => d.value);
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    let slices = svg.selectAll('path')
       .data(pie(data))
       .enter()
       .append('path')
       .attr('d', arc)
       .attr('fill', (d, i) => color(i))
       .attr('stroke', 'white')
       .style('stroke-width', '2px')
       .style("cursor", "pointer") // Make it clear it's clickable
       .on("click", function(event, d) {
           filterProjectsByYear(d.data.label);
           d3.select(this).style("opacity", 1).style("stroke", "black").style("stroke-width", "3px"); // Highlight clicked slice
       });

    // Legend setup
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
        .style("cursor", "pointer")
        .html((d, i) => 
            `<span class="swatch" style="width: 12px; height: 12px; display: inline-block; background-color: ${color(i)};"></span> 
             ${d.label} <em>(${d.value})</em>`
        )
        .on("click", function(event, d) {
            filterProjectsByYear(d.label);
            slices.style("opacity", 0.5);  // Fade out unselected slices
            d3.select(slices.filter(pathD => pathD.data.label === d.label)).style("opacity", 1);
        });
}

// Function to filter projects when clicking a slice
function filterProjectsByYear(year) {
    fetchJSON('../lib/projects.json').then((projects) => {
        let filteredProjects = projects.filter(project => project.year == year);

        // Update project list
        const projectsContainer = document.querySelector('.projects');
        projectsContainer.innerHTML = "";
        renderProjects(filteredProjects, projectsContainer, 'h2');

        // Keep the pie chart the same instead of changing it
    }).catch((error) => console.error("Error filtering projects:", error));
}

// Resize Pie Chart on Window Resize
window.addEventListener("resize", () => {
    renderPieChart(allProjects.filter(project => project.year.toString().includes(query)));
});

// Initialize projects
loadProjects();
