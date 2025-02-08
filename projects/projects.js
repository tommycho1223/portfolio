import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadProjects() {
    try {
        const projects = await fetchJSON('../projects.json');
        console.log("Fetched projects:", projects);
        
        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        if (projectsTitle) {
            projectsTitle.textContent = `${projects.length} Projects`;
        }

        renderProjects(projects, projectsContainer, 'h2');
        renderPieChart();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();

function renderPieChart() {
    let data = [1, 2];
    let colors = ['gold', 'purple'];
    
    let svg = d3.select("#projects-pie-plot");
    svg.selectAll("*").remove();
    let width = 200, height = 200, radius = Math.min(width, height) / 2;
    let g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
    let sliceGenerator = d3.pie();
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));

    arcs.forEach((arc, idx) => {
        g.append("path")
         .attr("d", arc)
         .attr("fill", colors[idx])
         .attr("stroke", "white")
         .style("stroke-width", "2px");
    });
}
