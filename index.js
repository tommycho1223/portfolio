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
        const profileStats = document.querySelector('#profile-stats');

        if (!profileContainer) {
            console.error('Error: No container with class .github-profile found.');
            return;
        }

        if (!profileStats) {
            console.error('Error: No container with id #profile-stats found.');
            return;
        }

        if (!githubData) {
            profileContainer.innerHTML = '<p>GitHub profile not available.</p>';
            return;
        }

        // Update the profileStats div with the formatted stats
        profileStats.innerHTML = `
            <dl>
                <dt>Followers</dt><dd>${githubData.followers}</dd>
                <dt>Following</dt><dd>${githubData.following}</dd>
                <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
                <dt>Public Gists</dt><dd>${githubData.public_gists}</dd>
            </dl>
        `;
    } catch (error) {
        console.error('Error loading GitHub profile:', error);
    }
}

// Call the function with your GitHub username
loadGitHubProfile('tommycho1223');
