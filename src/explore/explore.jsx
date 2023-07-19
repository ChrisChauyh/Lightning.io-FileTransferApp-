import React, { useEffect, useState } from "react";
// import './explore.css';
export function Explore() {
    const [uploads, setUploads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const newSocket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        setSocket(newSocket);

        newSocket.addEventListener("open", (event) => {
            console.log("WebSocket connection opened:", event);
        });

        newSocket.addEventListener("message", (event) => {
            console.log("WebSocket message received:", event.data);
            const msg = JSON.parse(event.data);
            displayMsg('player-messages', msg.from, msg.value);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const displayMsg = (cls, from, msg) => {
        setMessages(prevMessages => [
            { cls, from, msg },
            ...prevMessages,
        ]);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        const message = messageInput.trim();
        if (message !== "") {
            const username = localStorage.getItem("userName");
            broadcastEvent(username, message);
            setMessageInput("");
        }
    };

    const broadcastEvent = (from, value) => {
        const event = {
            from: from,
            value: value,
        };
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(event));
        } else {
            console.error('WebSocket connection not open.');
        }
    };


    useEffect(() => {
        fetch("/api/downloads")
            .then((response) => response.json())
            .then((uploads) => {
                setUploads(uploads);
                localStorage.setItem("uploads", JSON.stringify(uploads));
            })
            .catch(() => {
                const uploadsText = localStorage.getItem("uploads");
                if (uploadsText) {
                    setUploads(JSON.parse(uploadsText));
                }
            });
    }, []);

    useEffect(() => {
        const etableBodyEl = document.querySelector("#uploads");
        if (uploads.length) {
            // Update the DOM with the downloads
            etableBodyEl.innerHTML = ""; // Clear existing content
            uploads.forEach((upload, i) => {
                const epositionTdEl = document.createElement("td");
                const efilenameTdEl = document.createElement("td");
                const etextTdEl = document.createElement("td");
                const edateTdEl = document.createElement("td");
                const etimeTdEl = document.createElement("td");
                const ebuttonTdEl = document.createElement("button");
                const edownloadLink = document.createElement("a");
                epositionTdEl.textContent = i + 1;
                efilenameTdEl.textContent = upload.name;
                if(upload.text.length < 1)
                {
                    upload.text = "(---No text---)";
                }else if(upload.text.length > 20)
                {
                    upload.text = upload.text.substring(0, 20) + "...";

                }else{
                    upload.text = upload.text;
                }
                etextTdEl.textContent = upload.text;
                edateTdEl.textContent = upload.date;
                etimeTdEl.textContent = upload.count;

                edownloadLink.href =
                    "https://" +
                    window.location.hostname +
                    ":" +
                    window.location.port +
                    "/download/" +
                    upload.name;
                ebuttonTdEl.textContent = "Download";
                edownloadLink.appendChild(ebuttonTdEl);

                const erowEl = document.createElement("tr");
                erowEl.appendChild(epositionTdEl);
                erowEl.appendChild(efilenameTdEl);
                erowEl.appendChild(etextTdEl);
                erowEl.appendChild(edateTdEl);
                erowEl.appendChild(etimeTdEl);
                erowEl.appendChild(edownloadLink);

                etableBodyEl.appendChild(erowEl);
            });
        } else {
            etableBodyEl.innerHTML = "<tr><td colspan=4>No downloads found</td></tr>";
        }
    }, [uploads]);

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
                <tbody id="uploads"></tbody>
            </table>
            <span className="player">Chat history</span>
            <div id="player-messages"></div>

            <h1>ChatRoom</h1>
            <div>
                <div id="player-messages">
                    {messages.map((message, index) => (
                        <div key={index} className="event">
                            <span className={`${message.cls}-event`}>{message.from}</span>: {message.msg}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} id="message-form">
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        id="message-input"
                        placeholder="Type your message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>


        </main>
    );
}
