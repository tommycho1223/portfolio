let data = [];

async function loadData() {
    data = await d3.csv('loc.csv');
    console.log(data);  // Check structure in the console
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});
