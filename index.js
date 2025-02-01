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
