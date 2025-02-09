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

function renderPieChart(projects) {
    let container = document.getElementById("projects-pie-plot");
    let width = container.clientWidth || 250; // Get container width dynamically
    let height = width; // Maintain square aspect ratio
    let radius = Math.min(width, height) / 2 - 10;

    // Clear existing pie chart before redrawing
    d3.select("#projects-pie-plot").selectAll("*").remove();

    let rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    if (data.length === 0) return; // Avoid rendering an empty chart

    let svg = d3.select("#projects-pie-plot")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`)
                .attr("preserveAspectRatio", "xMidYMid meet")
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

    let color = d3.scaleOrdinal(d3.schemeTableau10);
    let pie = d3.pie().value(d => d.value);
    let arc = d3.arc().innerRadius(0).outerRadius(radius);

    // Append pie chart slices
    let slices = svg.selectAll('path')
       .data(pie(data))
       .enter()
       .append('path')
       .attr('d', arc)
       .attr('fill', (_, i) => color(i))
       .attr('stroke', 'white')
       .style('stroke-width', '2px')
       .style('cursor', 'pointer')
       .style('transition', 'transform 300ms ease-in-out')
       .on("mouseover", function() {
            d3.select(this).style("opacity", 0.7); // Highlight effect on hover
       })
       .on("mouseout", function() {
            d3.select(this).style("opacity", 1); // Reset on mouse out
       })
       .on("click", function(event, d) {
            filterByYear(d.data.label); // Call function to filter projects by year
       });

    // Update the legend
    let legendContainer = d3.select('.legend');
    legendContainer.selectAll("*").remove(); 

    legendContainer.selectAll('li')
        .data(data)
        .enter()
        .append('li')
        .style('cursor', 'pointer')
        .html((d, i) => 
            `<span class="swatch" style="width: 12px; height: 12px; display: inline-block; background-color: ${color(i)};"></span> 
             ${d.label} <em>(${d.value})</em>`
        )
        .on("click", function(event, d) {
            filterByYear(d.label); // Call function when clicking on a legend item
        });
}


// Function to filter projects by year when clicking pie chart
function filterByYear(year) {
    query = year.toString();
    filterProjects();
}

// Resize Pie Chart on Window Resize
window.addEventListener("resize", () => {
    renderPieChart(allProjects);
});

// Initialize projects
loadProjects();
