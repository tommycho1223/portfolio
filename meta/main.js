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
    // Create the <dl> element for displaying stats
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');

    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);

    // Add total commits
    dl.append('dt').text('Total Commits');
    dl.append('dd').text(commits.length);
}
