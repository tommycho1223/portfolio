import { fetchJSON, renderProjects } from './global.js';

async function loadLatestProjects() {
    try {
        const projects = await fetchJSON('./lib/projects.json');
        const latestProjects = projects.slice(0, 3); // Get the first 3 projects

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(latestProjects, projectsContainer, 'h2');
    } catch (error) {
        console.error('Error loading latest projects:', error);
    }
}

// Call function to load the latest projects
loadLatestProjects();

import { fetchGitHubData } from './global.js';

async function loadGitHubProfile() {
    const username = "tommycho1223";
    const profileContainer = document.querySelector('.github-profile');

    if (!profileContainer) {
        console.error('Error: No container with class .github-profile found.');
        return;
    }

    const data = await fetchGitHubData(username);

    if (data) {
        profileContainer.innerHTML = `
            <h2>${data.name || data.login}</h2>
            <p>Followers: ${data.followers}</p>
            <p>Following: ${data.following}</p>
            <p>Public Repos: ${data.public_repos}</p>
            <img src="${data.avatar_url}" alt="${data.login}" width="100">
        `;
    }
}

// Call function to load the GitHub profile
loadGitHubProfile();
