async function loadDownloads() {
    let downloads = [];
    try {
        // Get the latest downloads from the service
        const response = await fetch('/api/downloads');
        downloads = await response.json();

        // Save the scores in case we go offline in the future
        localStorage.setItem('downloads', JSON.stringify(downloads));
    } catch {
        // If there was an error then just use the last saved scores
        const downloadsText = localStorage.getItem('downloads');
        if (downloadsText) {
            downloads = JSON.parse(downloadsText);
        }
    }

    displayDownloads(downloads);
}

function displayDownloads(downloads) {
    const tableBodyEl = document.querySelector('#scores');

    if (downloads.length) {
        // Update the DOM with the scores
        for (const [i, download] of downloads.entries()) {
            const positionTdEl = document.createElement('td');
            const nameTdEl = document.createElement('td');
            const scoreTdEl = document.createElement('td');
            const dateTdEl = document.createElement('td');

            positionTdEl.textContent = i + 1;
            nameTdEl.textContent = download.email;
            scoreTdEl.textContent = download.filenametext;
            dateTdEl.textContent = download.textinput;

            const rowEl = document.createElement('tr');
            rowEl.appendChild(positionTdEl);
            rowEl.appendChild(nameTdEl);
            rowEl.appendChild(scoreTdEl);
            rowEl.appendChild(dateTdEl);

            tableBodyEl.appendChild(rowEl);
        }
    } else {
        tableBodyEl.innerHTML = '<tr><td colSpan=4>Be the first to score</td></tr>';
    }
}
// const random = Math.floor(Math.random() * 1000);
// callService(
//     `https://picsum.photos/v2/list?page=${random}&limit=1`,
//     displayPicture
// );
// callService("https://api.quotable.io/random", displayQuote);


loadDownloads();