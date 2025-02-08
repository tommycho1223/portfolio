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

// Fetch project data from projects.json and render pie chart dynamically
fetch('projects.json')
  .then(response => response.json())
  .then(projects => {
    let rolledData = d3.rollups(
      projects,
      v => v.length,  // Count projects per year
      d => d.year      // Group by year
    );

    let data = rolledData.map(([year, count]) => ({
      value: count,
      label: year
    }));

    console.log("Pie Chart Data:", data); // Debugging

    // Ensure pie chart only updates if data is available
    if (data.length > 0) {
        renderPieChart(data);
    } else {
        console.error("No valid data for pie chart.");
    }
}

function renderPieChart(data) {
    let width = 300;
    let height = 300;
    let radius = Math.min(width, height) / 2;
  
    let svg = d3.select('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`);

    svg.selectAll("*").remove(); // Clear previous pie chart
  
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
                  .style('stroke-width', '2px');
  
    let legend = d3.select('.legend').selectAll('li')
                   .data(data)
                   .enter()
                   .append('li')
                   .style('color', (d, i) => color(i))
                   .html(d => `<span class="swatch"></span> ${d.label} (${d.value})`);
}

  