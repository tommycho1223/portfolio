import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

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

async function loadGitHubProfile(username) {
    try {
        const githubData = await fetchGitHubData(username);
        const profileContainer = document.querySelector('.github-profile');

        if (!profileContainer) {
            console.error('Error: No container with class .github-profile found.');
            return;
        }

        if (!githubData) {
            profileContainer.innerHTML = '<p>GitHub profile not available.</p>';
            return;
        }

        // Populate the profile with data
        profileContainer.innerHTML = `
            <p><strong>${githubData.name}</strong></p>
            <p>Followers: ${githubData.followers}</p>
            <p>Following: ${githubData.following}</p>
            <p>Public Repos: ${githubData.public_repos}</p>
            <img src="${githubData.avatar_url}" alt="GitHub Profile Picture" width="100">
        `;
    } catch (error) {
        console.error('Error loading GitHub profile:', error);
    }
}

// Call the function with your GitHub username
loadGitHubProfile('tommycho1223');
