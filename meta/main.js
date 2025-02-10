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
    createScatterplot();  // Now that commits exist, we can plot them
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
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

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([0, width])
        .nice();

    const yScale = d3
        .scaleLinear()
        .domain([0, 24])
        .range([height, 0]);

    xScale.range([usableArea.left, usableArea.right]);
    yScale.range([usableArea.bottom, usableArea.top]);

    // Remove existing dots before updating
    svg.select('.dots').remove();

    const dots = svg.append('g').attr('class', 'dots');

    dots
        .selectAll('circle')
        .data(commits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', 5)
        .attr('fill', 'steelblue');

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

    
    // Add X axis
    svg.append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`) // Position it at the bottom
    .call(xAxis);

    // Add Y axis
    svg.append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`) // Position it on the left
    .call(yAxis);
}
