import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

let query = ''; // Declare search query variable
let projects = []; // Store all projects for filtering

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

// Loads all projects and adds search functionality
async function loadProjects() {
    try {
        projects = await fetchJSON('./projects.json'); // Fetch all projects
        const projectsContainer = document.querySelector('.projects');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        renderProjects(projects, projectsContainer, 'h2'); // Initial render

        // Add search event listener
        let searchInput = document.querySelector('.searchBar');
        searchInput.addEventListener('input', (event) => {
            query = event.target.value.toLowerCase();
            const filteredProjects = projects.filter(project =>
                project.title.toLowerCase().includes(query) ||
                project.description.toLowerCase().includes(query)
            );
            renderProjects(filteredProjects, projectsContainer, 'h2');
        });

    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Call both functions to ensure expected behavior
loadLatestProjects(); // Loads only the latest 3 projects
loadProjects(); // Loads all projects and enables search

async function loadGitHubProfile(username) {
    try {
        const githubData = await fetchGitHubData(username);
        const profileStats = document.querySelector('#profile-stats');

        if (!profileStats) {
            console.error('Error: No container with id #profile-stats found.');
            return;
        }

        if (!githubData) {
            profileStats.innerHTML = '<p>GitHub profile not available.</p>';
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

// Ensure it's actually called
loadGitHubProfile('tommycho1223');

