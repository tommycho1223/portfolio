let allProjects = []; // Store all projects globally

async function loadProjects() {
    try {
        allProjects = await fetchJSON('../lib/projects.json'); // Store globally

        console.log("Fetched projects:", allProjects); // Debugging line

        const projectsContainer = document.querySelector('.projects');
        const projectsTitle = document.querySelector('.projects-title');

        if (!projectsContainer) {
            console.error('Error: No container with class .projects found.');
            return;
        }

        // Update the heading with the number of projects
        if (projectsTitle) {
            projectsTitle.textContent = `${allProjects.length} Projects`;
        }

        renderProjects(allProjects, projectsContainer, 'h2');

        updatePieChart(allProjects);
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function filterProjects() {
    let filteredProjects = allProjects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    const projectsContainer = document.querySelector('.projects');
    renderProjects(filteredProjects, projectsContainer, 'h2');

    const projectsTitle = document.querySelector('.projects-title');
    if (projectsTitle) {
        projectsTitle.textContent = `${filteredProjects.length} Projects`;
    }

    updatePieChart(filteredProjects);
}

function updatePieChart(projects) {
    let rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year,
    }));

    renderPieChart(data);
}

// Load projects on page load
loadProjects();
