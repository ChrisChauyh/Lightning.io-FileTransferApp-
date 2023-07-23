
async function loadUploads() {
    let uploads = [];
    try {
        // Get the latest downloads from the BackEnd
        const response = await fetch('/api/downloads');
        uploads = await response.json();
        // Save the downloads in case we go offline in the future
        localStorage.setItem('uploads', JSON.stringify(uploads));

    } catch (error) {
        // If there was an error then just use the last saved downloads
        const uploadsText = localStorage.getItem('uploads');
        if (uploadsText) {
            uploads = JSON.parse(uploadsText);
        } else {
            console.error(error);
        }
    }
    const personDiv = document.getElementById("person");
    const userName = localStorage.getItem("userName");
    if(userName == null)
    {
        personDiv.textContent = "Your name: Anonymous";
    }else{
        personDiv.textContent = "Your name: " + userName;
    }

    displayuploads(uploads);
}

function displayuploads(uploads) {
    const etableBodyEl = document.querySelector('#uploads');
    if (uploads.length) {
        // Update the DOM with the downloads
        for (const [i, upload] of uploads.entries()) {
                const epositionTdEl = document.createElement('td');
                const efilenameTdEl = document.createElement('td');
                const etextTdEl = document.createElement('td');
                const edateTdEl = document.createElement('td');
                const etimeTdEl = document.createElement('td');
                const ebuttonTdEl = document.createElement('button');
                const edownloadLink = document.createElement('a');
                epositionTdEl.textContent = i+1;
                efilenameTdEl.textContent = upload.name;
                etextTdEl.textContent = upload.text;
                edateTdEl.textContent = upload.date;
                etimeTdEl.textContent = upload.count;


                edownloadLink.href = "https://" + window.location.hostname + ":" + window.location.port + "/download/" + upload.name;
                ebuttonTdEl.textContent = 'Download';
                edownloadLink.appendChild(ebuttonTdEl);

                const erowEl = document.createElement('tr');
                erowEl.appendChild(epositionTdEl);
                erowEl.appendChild(efilenameTdEl);
                erowEl.appendChild(etextTdEl);
                erowEl.appendChild(edateTdEl);
                erowEl.appendChild(etimeTdEl);
                erowEl.appendChild(edownloadLink);

                etableBodyEl.appendChild(erowEl);

        }
    } else {
        etableBodyEl.innerHTML = '<tr><td colspan=4>No downloads found</td></tr>';
    }
}
function displayMsg(cls, from, msg) {
    const chatText = document.querySelector('#player-messages');
    chatText.innerHTML =
        `<div class="event"><span class="${cls}-event">${from}</span>: ${msg}</div>` + chatText.innerHTML;
}

function configureWebSocket() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

    const messagesContainer = document.getElementById("messages-container");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");

    socket.addEventListener("open", (event) => {
        console.log("WebSocket connection opened:", event);
    });

    socket.addEventListener("message", (event) => {
        console.log("WebSocket message received:", event.data);
        const msg = JSON.parse(event.data);
        displayMsg('player-messages', msg.from, msg.value);
    });

    messageForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = messageInput.value.toString();
        const username = localStorage.getItem("userName");
        broadcastEvent(username, message);
        messageInput.value = "";
    });

    function broadcastEvent(from, value) {
        const event = {
            from: from,
            value: value,
        };
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(event));
        } else {
            console.error('WebSocket connection not open.');
        }
    }
}

configureWebSocket();
loadUploads();