let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv');
    processCommits();  // Process commit data AFTER data is loaded
    console.log(commits);  // Debugging: Print processed commits
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
                datetime: first.datetime,
                hourFrac: first.datetime.getHours() + first.datetime.getMinutes() / 60,  // Decimal hour
                totalLines: lines.length  // Count modified lines
            };
        });

    console.log(commits);  // Debugging: Print processed commits
}
