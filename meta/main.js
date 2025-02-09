let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv');
    processCommits();  // Process commit data AFTER data is loaded
    displayStats();  // Display statistics after processing commits
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});

function processCommits() {
    commits = d3.groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
            let first = lines[0];  // Metadata from first entry

            return {
                id: commit,
                url: `https://github.com/tommycho1223/portfolio/commit/${commit}`,
                author: first.author,
                date: first.date,
                time: first.time,
                timezone: first.timezone,
                datetime: new Date(first.datetime),  // Convert to Date object
                hourFrac: new Date(first.datetime).getHours() + new Date(first.datetime).getMinutes() / 60,  // Decimal hour
                totalLines: lines.length  // Count modified lines
            };
        });

    console.log(commits);  // Debugging: Print processed commits
}

function displayStats() {
    processCommits();

    // Select stats container and clear it
    const statsContainer = d3.select("#stats");
    statsContainer.html(""); // Clear previous content

    // Create a summary table
    const table = statsContainer.append("table").attr("class", "stats-table");
    const tbody = table.append("tbody");

    // Helper function to add rows
    function addRow(label, value) {
        const row = tbody.append("tr");
        row.append("td").attr("class", "stats-label").text(label);
        row.append("td").attr("class", "stats-value").text(value);
    }

    // Add statistics
    addRow("Total LOC", data.length);
    addRow("Total Commits", commits.length);
    addRow("Number of Files", d3.groups(data, d => d.file).length);
    addRow("Max Depth", d3.max(data, d => d.depth));
    addRow("Longest Line", d3.max(data, d => d.length));
    addRow("Max Lines (Largest File)", d3.max(d3.rollups(data, v => v.length, d => d.file), d => d[1]));

    // Time of day analysis
    const workByPeriod = d3.rollups(data, v => v.length, d => new Date(d.datetime).toLocaleString('en', { hour: 'numeric', hour12: true }));
    const maxPeriod = d3.greatest(workByPeriod, d => d[1])?.[0];
    addRow("Most Active Hour", maxPeriod);

    // Day of the week analysis
    const workByDay = d3.rollups(data, v => v.length, d => new Date(d.datetime).toLocaleString('en', { weekday: 'long' }));
    const maxDay = d3.greatest(workByDay, d => d[1])?.[0];
    addRow("Most Active Day", maxDay);
}