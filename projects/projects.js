import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

let query = ''; // Store search input
let allProjects = []; // Store fetched projects
let selectedYear = null; // Track selected year

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
        let matchesQuery = query ? values.includes(query) : true;
        let matchesYear = selectedYear ? project.year === selectedYear : true;

        return matchesQuery && matchesYear; // Apply both filters together
    });

    // Update project count
    const projectsTitle = document.querySelector('.projects-title');
    if (projectsTitle) {
        projectsTitle.textContent = `${filteredProjects.length} Projects`;
    }

    // Render filtered projects
    const projectsContainer = document.querySelector('.projects');
    projectsContainer.innerHTML = ""; // Clear previous projects
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // Update Pie Chart & Legend **only based on visible projects**
    renderPieChart(filteredProjects);
}

function renderPieChart(data) {
    let container = document.getElementById("projects-pie-plot");
    let width = container.clientWidth || 250;
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

    // Group projects by year **ONLY IN FILTERED DATA**
    let groupedData = d3.rollups(
        data,
        v => v.length,
        d => d.year
    ).map(([year, count]) => ({
        label: year,
        value: count
    }));

    let pie = d3.pie().value(d => d.value);
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    let slices = svg.selectAll('path')
        .data(pie(groupedData))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => (d.data.label === selectedYear ? "green" : color(i)))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            if (selectedYear === d.data.label) {
                selectedYear = null;
            } else {
                selectedYear = d.data.label;
            }
            filterProjects(); // Reapply filter after clicking
        });

    // Update legend correctly
    let legendContainer = d3.select('.legend');
    legendContainer.selectAll("*").remove();

    legendContainer.selectAll('li')
        .data(groupedData)
        .enter()
        .append('li')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px')
        .style("cursor", "pointer")
        .html((d, i) => 
            `<span class="swatch" style="width: 12px; height: 12px; display: inline-block; background-color: ${d.label === selectedYear ? "green" : color(i)};"></span> 
             ${d.label} <em>(${d.value})</em>`
        )
        .on("click", function(event, d) {
            if (selectedYear === d.label) {
                selectedYear = null;
            } else {
                selectedYear = d.label;
            }
            filterProjects(); // Reapply filter after clicking
        });
}

// Resize Pie Chart on Window Resize
window.addEventListener("resize", () => {
    renderPieChart(allProjects.filter(project => project.year.toString().includes(query)));
});

// Initialize projects
loadProjects();
