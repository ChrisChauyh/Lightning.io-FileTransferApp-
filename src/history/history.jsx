import React, { useEffect, useState } from "react";
export function History() {
    const [downloads, setHistory] = useState([]);

    useEffect(() => {
        fetch("/api/downloads")
            .then((response) => response.json())
            .then((histories) => {
                setHistory(histories);
                localStorage.setItem("histories", JSON.stringify(histories));
            })
            .catch(() => {
                const historiesText = localStorage.getItem("histories");
                if (historiesText) {
                    setHistory(JSON.parse(historiesText));
                }
            });
    }, []);
    useEffect(() => {
    const tableBodyEl = document.querySelector('#scores');
    let list = 0;
    if (downloads.length) {
        // Update the DOM with the downloads
        for (const [i, download] of downloads.entries()) {
            if (localStorage.getItem("userName") == download.username) {
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

                downloadLink.href = "https://" + window.location.hostname + ":" + window.location.port + "/download/" + download.downloadLink;
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
}, [downloads]);
  return (
      <main className="container-fluid bg-secondary text-center">
          <table className="table table-warning table-striped-columns">
              <thead className="table-dark">
              <tr>
                  <th>Item</th>
                  <th>FileName</th>
                  <th>Text</th>
                  <th>Date&Time</th>
                  <th>Download Times</th>
                  <th>Download Link</th>
              </tr>
              </thead>
              <tbody id="scores"></tbody>
          </table>
      </main>
  );
}