let xScale, yScale;
let data = [];
let commits = [];
const width = 1000;
const height = 600;
let brushSelection = null; // Store selection range
let selectedCommits = []; // New global variable to store selected commits
let commitProgress = 100; // Default to showing all commits
let NUM_ITEMS = 100; // Set to the commit history length if possible
let ITEM_HEIGHT = 60; // Controls the height of commit items
let VISIBLE_COUNT = 10; // Number of items visible at a time
let totalHeight = (NUM_ITEMS - 1) * ITEM_HEIGHT;


const scrollContainer = d3.select("#scroll-container");
const spacer = d3.select("#spacer");
spacer.style("height", `${totalHeight}px`);

const itemsContainer = d3.select("#items-container");

renderItems(commits.length > VISIBLE_COUNT ? VISIBLE_COUNT : commits.length);

// Attach scroll event listener
scrollContainer.on("scroll", () => {
    const scrollTop = scrollContainer.property("scrollTop");
    let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
    startIndex = Math.max(0, Math.min(startIndex, commits.length - VISIBLE_COUNT));
    
    // Update commits and scatterplot at the same time
    renderItems(startIndex);
});

const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');

async function loadData() {
    data = await d3.csv('loc.csv');
    console.log("CSV Data Sample:", data.slice(0, 10)); // Debugging

    processCommits();  // Process commit data AFTER data is loaded
    displayStats();  // Display statistics after processing commits
    createScatterplot();  // Now that commits exist, we can plot them

    renderItems(0);

    // Create a time scale for slider mapping
    timeScale = d3.scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([0, 100]);

    // updateSelectedTime(); // Ensure time display updates initially

    // Attach event listener for the slider
    document.getElementById('commit-slider').addEventListener('input', (event) => {
        commitProgress = +event.target.value;  // Convert to number
        // updateSelectedTime();  // Update time display
        // filterCommits();  // Filter commits based on slider value
    });

    // filterCommits(); // Apply filtering immediately when the page loads
}

// document.addEventListener('DOMContentLoaded', async () => {
//     await loadData();
//     await loadFileData();
// });

function processCommits() {
    commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
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
            totalLines: lines.length,
            lines: lines // ✅ This fixes missing data
        };
    });

    console.log("Processed commits with lines:", commits);
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

function createScatterplot(filteredCommits = commits) {
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
    const sortedCommits = d3.sort(filteredCommits, (d) => -d.totalLines);

    // Define scales
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

    const rScale = d3
        .scaleSqrt()
        .domain([minLines, maxLines])
        .range([2, 30]);

    xScale = d3.scaleTime()
        .domain(d3.extent(filteredCommits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();
    
    yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);

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
        })
        .on("click", (event, commit) => {
            // Toggle commit selection
            if (selectedCommits.includes(commit)) {
                selectedCommits = selectedCommits.filter(c => c !== commit);
            } else {
                selectedCommits.push(commit);
            }
            updateSelection();
            updateSelectionCount();
            updateLanguageBreakdown();
        });

    // Add X axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${yScale(0)})`)
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

    brushSelector(); // Enable brushing
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
    const svg = d3.select('svg'); // Select the scatterplot SVG

    const brush = d3.brush()
        .on('start brush end', brushed); // Listen for brush events

    svg.call(brush);

    // Fix tooltip issue by ensuring dots are raised above the brush overlay
    svg.selectAll('.dots, .overlay ~ *').raise();
}

function brushed(event) {
    console.log("Brush event triggered:", event.selection);
    
    if (event.selection) {
        let [minX, minY] = event.selection[0];
        let [maxX, maxY] = event.selection[1];

        selectedCommits = commits.filter(commit => {
            let x = xScale(commit.datetime);
            let y = yScale(commit.hourFrac);
            return x >= minX && x <= maxX && y >= minY && y <= maxY;
        });
    } else {
        selectedCommits = [];
    }

    updateSelection();
    updateSelectionCount();
    displayCommitFiles(selectedCommits);  // Ensure file breakdown updates
}

function isCommitSelected(commit) {
    return selectedCommits.includes(commit);
}

function updateSelection() {
    console.log("Updating selection...");
    d3.selectAll('circle')
        .classed('selected', (d) => selectedCommits.includes(d))
        .attr('fill', (d) => selectedCommits.includes(d) ? '#ff666b' : 'steelblue');
}

function updateSelectionCount() {
    const countElement = document.getElementById('selection-count');

    if (selectedCommits.length > 0) {
        countElement.textContent = `${selectedCommits.length} commits selected`;
    } else {
        countElement.textContent = "";
    }
}


function updateLanguageBreakdown() {
    console.log("Updating language breakdown...");
    const selectedCommits = brushSelection
        ? commits.filter(isCommitSelected)
        : [];
    
    console.log("Selected for breakdown:", selectedCommits);
    console.log("Selected commits:", selectedCommits);
    console.log("Lines in selected commits:", selectedCommits.map(c => c.lines));

    const container = document.getElementById('language-breakdown');
    if (!container) return; // Ensure the element exists before updating

    if (selectedCommits.length === 0) {
        container.innerHTML = '';
        return;
    }

    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap(d => d.lines).filter(d => d !== undefined);

    // console.log("Total lines:", lines);
    console.log("Checking lines data:", lines);

    if (lines.length === 0) {
        console.warn("No valid lines found, skipping breakdown update.");
        container.innerHTML = "<p>No language data available for selected commits.</p>";
        return;
    }

    // Fix: Ensure every line has a 'type' property before rollup
    const breakdown = d3.rollup(
        lines.filter(d => d && d.type !== undefined), // Ensure 'type' exists
        v => v.length,
        d => d.type
    );

    console.log("Breakdown:", breakdown);

    container.innerHTML = '';
    for (const [language, count] of breakdown) {
        const proportion = count / lines.length;
        const formatted = d3.format('.1%')(proportion);

        container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
    }
}

// function updateSelectedTime() {
//     const selectedTime = document.getElementById('selected-time');
//     selectedTime.textContent = timeScale.invert(commitProgress).toLocaleString('en', {
//         dateStyle: 'long',
//         timeStyle: 'short'
//     });
// }

// function filterCommits() {
//     let maxTime = timeScale.invert(commitProgress);
//     let filteredCommits = commits.filter(commit => commit.datetime <= maxTime);

//     createScatterplot(filteredCommits);
//     processFiles(filteredCommits);
// }

function processFiles(filteredCommits) {
    let allLines = filteredCommits.flatMap(commit => commit.lines || []);

    let files = d3.groups(allLines, (d) => d.file)
        .map(([name, lines]) => ({
            name, 
            lines 
        }));

    // Sort files in descending order based on the number of lines
    files = d3.sort(files, (d) => -d.lines.length);

    updateFileVisualization(files);
}

function updateFileVisualization(files) {
    let container = d3.select('.files');

    // // Remove old elements
    // container.selectAll('div').remove();

    // Bind data
    let fileSelection = container.selectAll('div')
        .data(files)
        .enter()
        .append('div');

    // Append filename
    fileSelection.append('dt')
        .append('code')
        .text(d => d.name);

    // Append total line count (optional)
    fileSelection.append('small')
        .text(d => ` ${d.lines.length} lines`);

    // Create an ordinal scale mapping file types to colors
    let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

    // Apply colors based on file type
    fileSelection.append('dd')
        .selectAll('.line')
        .data(d => d.lines) // Bind each line
        .enter()
        .append('div')
        .attr('class', 'line') // Apply CSS class for styling
        .style('background', d => fileTypeColors(d.type)); // Assign color based on line type

}

function renderItems(startIndex) {
    // // Clear previous items
    // itemsContainer.selectAll("div").remove();

    // Determine visible commits
    const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
    let newCommitSlice = commits.slice(startIndex, endIndex);

    // Update scatterplot and file display
    createScatterplot(newCommitSlice);
    displayCommitFiles(newCommitSlice);

    // Render commit narratives
    itemsContainer.selectAll("div")
        .data(newCommitSlice)
        .enter()
        .append("div")
        .attr("class", "item")
        .style("position", "absolute")
        .style("top", (_, idx) => `${(startIndex + idx) * ITEM_HEIGHT}px`)
        .html((commit, index) => `
        <p>
            On ${commit.datetime.toLocaleString("en", { dateStyle: "short", timeStyle: "short" })}, 
            I made 
            <a href="${commit.url}" target="_blank">
                ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
            </a>. 
            I edited ${commit.totalLines} lines across 
            ${d3.rollups(commit.lines, D => D.length, d => d.file).length} files.
        </p>
    `);
}

function displayCommitFiles(filteredCommits) {
    const container = d3.select(".files");
    container.html("");  // Clear previous file details

    if (filteredCommits.length === 0) {
        container.append("p").text("No commits selected.");
        return;
    }

    const lines = filteredCommits.flatMap(d => d.lines);
    let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

    let files = d3.groups(lines, d => d.file).map(([name, lines]) => ({
        name, lines
    }));

    files = d3.sort(files, (d) => -d.lines.length);

    let fileContainer = container.selectAll("div")
        .data(files)
        .enter()
        .append("div");

    fileContainer.append("dt").html(d => `<code>${d.name}</code><small>${d.lines.length} lines</small>`);

    fileContainer.append("dd")
        .selectAll("div")
        .data(d => d.lines)
        .enter()
        .append("div")
        .attr("class", "line")
        .style("background", d => fileTypeColors(d.type));
}

let fileData = [];  // Store file size changes
let NUM_FILE_ITEMS = 100; 
let ITEM_HEIGHT_FILES = 60;
let VISIBLE_COUNT_FILES = 10;
let totalHeightFiles = (fileData.length - 1) * ITEM_HEIGHT_FILES; 

// Selectors
const scrollContainerFiles = d3.select("#scroll-container-files");
const spacerFiles = d3.select("#spacer-files");
spacerFiles.style("height", `${totalHeightFiles}px`);

const itemsContainerFiles = d3.select("#items-container-files");

// Load and process file data (Assuming `loc.csv` contains file data)
async function loadFileData() {
    fileData = await d3.csv('loc.csv'); 
    console.log("Loaded file data:", fileData);

    processFileData();  // Process file-related data
    renderFileDotVisualization();
    renderFileItems(0); // Render initial scrollytelling items
}

function processFileData() {
    fileData = fileData.map(file => ({
        filename: file.file || "Unknown File",
        lines_changed: +file.lines || 0,  // Convert to number, set default 0
        commit: file.commit || "Unknown Commit",
        author: file.author || "Unknown Author",
        date: new Date(file.datetime || Date.now()),  // Use current time if missing
    }));
}

// Render File Items in Scrollytelling
function renderFileItems(startIndex) {
    const endIndex = Math.min(startIndex + VISIBLE_COUNT_FILES, fileData.length);
    let fileSlice = fileData.slice(startIndex, endIndex);

    console.log("Rendering file items:", fileSlice); // Debugging

    itemsContainerFiles.selectAll("div").remove(); // Clear old messages

    itemsContainerFiles.selectAll("div")
        .data(fileSlice)
        .enter()
        .append("div")
        .attr("class", "item")
        .style("position", "absolute")
        .style("top", (_, idx) => `${(startIndex + idx) * ITEM_HEIGHT_FILES}px`)
        .html(file => {
            console.log("File entry:", file); // Debugging
        
            if (!file || !file.filename || file.lines_changed === undefined) {
                return `<p><b>Data missing</b></p>`;
            }
        
            return `
                <p>
                    <b>${file.filename}</b> had <b>${file.lines_changed}</b> lines edited.
                </p>
            `;
        });        
}

function renderFileDotVisualization() {
    if (!fileData.length) return;  

    const fileContainer = d3.select('#file-dot-visualization');

    const fileGroups = fileContainer.selectAll('.file-group')
        .data(fileData)
        .enter()
        .append('div')
        .attr('class', 'file-group');

    fileGroups.append('div')
        .attr('class', 'file-name')
        .text(d => d.filename);

    fileGroups.append('div')
        .attr('class', 'dot-container')
        .html(d => {
            let dots = "";
            for (let i = 0; i < d.lines_changed; i += 5) {  // 1 dot per 5 lines
                dots += "•";
            }
            return dots;
        });
}

// Handle scrolling
scrollContainerFiles.on("scroll", () => {
    const scrollTop = scrollContainerFiles.property("scrollTop");
    let startIndex = Math.floor(scrollTop / ITEM_HEIGHT_FILES);
    startIndex = Math.max(0, Math.min(startIndex, fileData.length - VISIBLE_COUNT_FILES));

    console.log("Scrolling...", scrollTop, startIndex);
    renderFileItems(startIndex);
});

// Load data when page loads
// document.addEventListener('DOMContentLoaded', async () => {
// });

document.addEventListener('DOMContentLoaded', async () => {
    await loadData(); // Loads commit data
    await loadFileData(); // Loads file data for scrollytelling
});