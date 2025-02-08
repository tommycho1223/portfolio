console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

export function renderProjects(projects, container, headingTag = 'h2') {
    if (!container) {
        console.error("Error: Projects container not found.");
        return;
    }
    container.innerHTML = '';
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects available.</p>';
        return;
    }

    const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!validHeadings.includes(headingTag)) {
        console.warn(`Invalid heading level: ${headingTag}. Defaulting to h2.`);
        headingTag = 'h2';
    }

    projects.forEach(project => {
        const article = document.createElement('article');
        article.classList.add('project-card');

        const title = document.createElement(headingTag);
        title.textContent = project.title;

        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;

        const descriptionWrapper = document.createElement('div');
        descriptionWrapper.classList.add('project-description-wrapper');

        const description = document.createElement('p');
        description.textContent = project.description;

        const year = document.createElement('p');
        year.classList.add('project-year');
        year.textContent = `© ${project.year || 'Unknown Year'}`;

        descriptionWrapper.appendChild(description);
        descriptionWrapper.appendChild(year);

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('project-content');
        contentWrapper.appendChild(title);
        contentWrapper.appendChild(img);
        contentWrapper.appendChild(descriptionWrapper);

        article.appendChild(contentWrapper);
        container.appendChild(article);
    });
}
