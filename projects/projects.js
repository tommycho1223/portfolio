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
        renderPieChart(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();

async function renderPieChart() {
    try {
        const projects = await fetchJSON('../projects.json');
        let data = d3.rollups(
            projects,
            v => v.length,
            d => d.year
        ).map(([year, count]) => ({ value: count, label: year }));

        let svg = d3.select('#projects-pie-plot');
        svg.selectAll("*").remove();
        let width = 200, height = 200, radius = Math.min(width, height) / 2;
        let g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);
        let color = d3.scaleOrdinal(d3.schemeTableau10);
        let pie = d3.pie().value(d => d.value);
        let arc = d3.arc().innerRadius(0).outerRadius(radius);

        g.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => color(i))
            .attr("stroke", "white");

    } catch (error) {
        console.error('Error rendering pie chart:', error);
    }
}
