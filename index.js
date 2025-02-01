import { fetchGitHubData } from './global.js';

async function loadGitHubProfile() {
    try {
        const projects = await fetchJSON('./lib/projects.json'); // Ensure correct path
        const latestProjects = projects.slice(0, 3); // Only take the first 3

        const projectsContainer = document.querySelector('.projects');
        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(latestProjects, projectsContainer, 'h2'); // Render projects
    } catch (error) {
        console.error('Error loading latest projects:', error);
    }
    
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
