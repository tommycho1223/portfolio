let commits = [];

// Set up the scatterplot
const width = 1000;
const height = 600;
const margin = { top: 10, right: 10, bottom: 30, left: 20 };
const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
};

async function loadData() {
    try {
        const response = await fetch('meta/loc.csv'); // Ensure the correct path
        const rawText = await response.text();

        // Parse CSV data
        commits = d3.csvParse(rawText, d => ({
            id: d.id,
            datetime: new Date(d.datetime),
            totalLines: +d.totalLines
        }));

        // Now that `commits` is loaded, create the scatterplot
        createScatterplot();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Create scales
const xScale = d3.scaleTime().range([0, width]).nice();
const yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);

// Define the SVG element
const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

// Function to create scatterplot
function createScatterplot() {
    if (!commits || commits.length === 0) return;

    // Update scales
    xScale.domain(d3.extent(commits, d => d.datetime));

    // Define a square root scale for radius
    const [minLines, maxLines] = d3.extent(commits, d => d.totalLines);
    const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]);

    // Sort commits by totalLines in descending order
    const sortedCommits = [...commits].sort((a, b) => b.totalLines - a.totalLines);

    // Append dots for scatterplot
    const dots = svg.append('g').selectAll('circle').data(sortedCommits).join('circle')
        .attr('cx', d => xScale(d.datetime))
        .attr('cy', d => yScale(d.datetime.getHours()))
        .attr('r', d => rScale(d.totalLines))
        .style('fill', 'steelblue')
        .style('fill-opacity', 0.7)
        .on('mouseenter', (event, commit) => {
            updateTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
            d3.select(event.currentTarget).style('fill-opacity', 1);
        })
        .on('mouseleave', (event) => {
            updateTooltipContent({});
            updateTooltipVisibility(false);
            d3.select(event.currentTarget).style('fill-opacity', 0.7);
        });

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => `${d % 24}:00`);
    
    svg.append('g')
        .attr('transform', `translate(0, ${usableArea.bottom})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    // Add gridlines
    const gridlines = svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);
    
    gridlines.call(d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width));
}

// Tooltip handling functions
function updateTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    if (Object.keys(commit).length === 0) return;

    link.href = commit.url;
    link.textContent = commit.id;
    date.textContent = commit.datetime.toLocaleString('en', { dateStyle: 'full' });
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

// Load data on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});
