let data = [];
let commits = [];
const width = 1000;
const height = 600;

const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

async function loadData() {
    data = await d3.csv('loc.csv');
    processCommits();  // Process commit data AFTER data is loaded
    displayStats();  // Display statistics after processing commits
    // createScatterplot();  // Now that commits exist, we can plot them
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    createScatterplot();  // Now that commits exist, we can plot them
    brushSelector(); // Enable brushing
});

function processCommits() {
    commits = d3.groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
            let first = lines[0];

            return {
                id: commit,
                url: `https://github.com/tommycho1223/portfolio/commit/${commit}`,
                author: first.author,
                date: first.date,
                time: first.time,
                timezone: first.timezone,
                datetime: new Date(first.datetime),
                hourFrac: new Date(first.datetime).getHours() + new Date(first.datetime).getMinutes() / 60,
                totalLines: lines.length
            };
        });

    console.log(commits);
}

function displayStats() {
    function setText(id, value) {
        document.getElementById(id).textContent = value;
    }

    setText("total-commits", commits.length);
    setText("total-files", d3.groups(data, d => d.file).length);
    setText("total-loc", data.length);
    setText("max-depth", d3.max(data, d => d.depth) || 0);
    setText("longest-line", d3.max(data, d => d.length) || 0);
    setText("max-lines", d3.max(d3.rollups(data, v => v.length, d => d.file), d => d[1]) || 0);

    const workByPeriod = d3.rollups(data, v => v.length, d => new Date(d.datetime).toLocaleString('en', { hour: 'numeric', hour12: true }));
    const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0] || "Unknown";
    setText("most-active-hour", maxPeriod);

    const workByDay = d3.rollups(data, v => v.length, d => new Date(d.datetime).toLocaleString('en', { weekday: 'long' }));
    const maxDay = d3.greatest(workByDay, d => d[1])?.[0] || "Unknown";
    setText("most-active-day", maxDay);
}

function createScatterplot() {
    if (!commits.length) return;  // Prevents rendering if data is empty

    const margin = { top: 10, right: 10, bottom: 30, left: 50 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    // Ensure commits are sorted by total lines
    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

    // Define scales
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain([0, 24])
        .range([height, 0]);

    const rScale = d3
        .scaleSqrt()
        .domain([minLines, maxLines])
        .range([2, 30]);

    // Remove old elements
    svg.select('.dots').remove();
    svg.select('.x-axis').remove();
    svg.select('.y-axis').remove();
    svg.select('.gridlines').remove();

    // Create dots group
    const dots = svg.append('g').attr('class', 'dots');

    dots
        .selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('r', (d) => rScale(d.totalLines))
        .style('fill-opacity', 0.7)
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('fill', 'steelblue')
        .on('mouseenter', (event, commit) => {
            d3.select(event.currentTarget).style('fill-opacity', 1);
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mouseleave', () => {
            d3.select(event.currentTarget).style('fill-opacity', 0.7);
            updateTooltipContent({});
            updateTooltipVisibility(false);
        });

    // Add X axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(d3.axisBottom(xScale));

    // Add Y axis
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, '0') + ':00'));

    // Add Gridlines
    const gridlines = svg
        .append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

    gridlines.call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
}


function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');

    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = new Date(commit.datetime).toLocaleString('en', {
        dateStyle: 'full',
    });
}

function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX}px`;
    tooltip.style.top = `${event.clientY}px`;
}

function brushSelector() {
    const svg = document.querySelector('svg'); 
    d3.select(svg).call(d3.brush());
}