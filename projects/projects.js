import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    try {
        const projects = await fetchJSON('../lib/projects.json');

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load and render projects
loadProjects();