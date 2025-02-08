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

// === PIE CHART CODE ===

// // Data for the pie chart (with labels)
// let data = [
//     { value: 1, label: 'apples' },
//     { value: 2, label: 'oranges' },
//     { value: 3, label: 'mangos' },
//     { value: 4, label: 'pears' },
//     { value: 5, label: 'limes' },
//     { value: 5, label: 'cherries' },
// ];

// // Generate pie slice angles using D3
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data); // Generate slices automatically

// // Create an arc generator
// let pieArcGenerator = d3.arc()
//     .innerRadius(0)  // Full pie (0 for full pie, >0 for donut chart)
//     .outerRadius(50); // Pie radius

// // Define colors for slices
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// // Select the existing SVG and append slices
// d3.select("#projects-pie-plot")
//   .selectAll("path")
//   .data(arcData) // ✅ Use arcData directly
//   .enter()
//   .append("path")
//   .attr("d", d => pieArcGenerator(d)) // ✅ Generate arc paths here
//   .attr("fill", (_, i) => colors(i)); // Assign colors dynamically

// let legend = d3.select(".legend"); // Select the legend <ul>

// data.forEach((d, idx) => {
//     legend.append("li")
//         .attr("style", `--color:${colors(idx)}`) // Assigns the slice's color
//         .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // Adds label and value
// });

// // Fetch project data from projects.json or another source
// fetch('projects.json')
//   .then(response => response.json())
//   .then(projects => {
//     // Process project data
//     let rolledData = d3.rollups(
//       projects,
//       v => v.length,  // Count projects per year
//       d => d.year      // Group by year
//     );

//     // Convert to the expected format for the pie chart
//     let data = rolledData.map(([year, count]) => ({
//       value: count,
//       label: year
//     }));

//     // Now use this data for rendering the pie chart
//     renderPieChart(data);
// });

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

    // Fix the legend update
    let legendContainer = d3.select('.legend');
    legendContainer.selectAll("*").remove(); 

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
    renderPieChart(data); // Re-render on resize
});
