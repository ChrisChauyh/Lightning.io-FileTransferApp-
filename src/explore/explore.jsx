import React, { useEffect, useState } from "react";
import { handleDownload } from "../downloadAndDelete";

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

    return (
        <main className="container-fluid bg-secondary text-center">
            <table className="table table-warning table-striped-columns">
                <thead className="table-dark">
                <tr>
                    <th>Item</th>
                    <th>FileName</th>
                    <th>User</th>
                    <th>Text</th>
                    <th>Date&Time</th>
                    <th>Download Times</th>
                    <th>Download Link</th>
                </tr>
                </thead>
                <tbody>
                {uploads.length > 0 ? (
                    uploads.map((upload, i) => {
                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{upload.name}</td>
                                <td>{upload.username}</td>
                                <td>
                                    {upload.text.length < 1
                                        ? "(---No text---)"
                                        : upload.text.length > 20
                                            ? `${upload.text.substring(0, 20)}...`
                                            : upload.text}
                                </td>
                                <td>{upload.date}</td>
                                <td>{upload.count}</td>
                                <td>
                                    <a href="#" onClick={() => handleDownload(upload)}>
                                        Download File
                                    </a>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={6}>No downloads found</td>
                    </tr>
                )}
                </tbody>
            </table>
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
