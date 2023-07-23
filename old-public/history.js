async function loadDownloads() {
    let downloads = [];
    try {
        // Get the latest downloads from the BackEnd
        const response = await fetch('/api/downloads');
        downloads = await response.json();

        // Save the downloads in case we go offline in the future
        localStorage.setItem('downloads', JSON.stringify(downloads));
    } catch (error) {
        // If there was an error then just use the last saved downloads
        const downloadsText = localStorage.getItem('downloads');
        if (downloadsText) {
            downloads = JSON.parse(downloadsText);
        } else {
            console.error(error);
        }
    }

    displayDownloads(downloads);
}

function displayDownloads(downloads) {
    const tableBodyEl = document.querySelector('#scores');
    let list = 0;
    if (downloads.length) {
        // Update the DOM with the downloads
        for (const [i, download] of downloads.entries()) {
            if(localStorage.getItem("userName") == download.username){
                list++;
                const positionTdEl = document.createElement('td');
                const filenameTdEl = document.createElement('td');
                const textTdEl = document.createElement('td');
                const dateTdEl = document.createElement('td');
                const timeTdEl = document.createElement('td');
                const buttonTdEl = document.createElement('button');
                const downloadLink = document.createElement('a');
                positionTdEl.textContent = list.toString();
                filenameTdEl.textContent = download.name;
                textTdEl.textContent = download.text;
                dateTdEl.textContent = download.date;
                timeTdEl.textContent = download.count;

                downloadLink.href = "https://" + window.location.hostname + ":" + window.location.port + "/download/" + download.name;
                buttonTdEl.textContent = 'Download';
                downloadLink.appendChild(buttonTdEl);

                const rowEl = document.createElement('tr');
                rowEl.appendChild(positionTdEl);
                rowEl.appendChild(filenameTdEl);
                rowEl.appendChild(textTdEl);
                rowEl.appendChild(dateTdEl);
                rowEl.appendChild(timeTdEl);
                rowEl.appendChild(downloadLink);

                tableBodyEl.appendChild(rowEl);
            }

        }
    } else {
        tableBodyEl.innerHTML = '<tr><td colspan=4>No downloads found</td></tr>';
    }
}

loadDownloads();