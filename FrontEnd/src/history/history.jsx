import React, {useEffect, useState} from "react";
import { handleDownload, handleDelete} from "../downloadAndDelete";




export function History({}) {
    const [downloads, setDownloads] = useState([]);

    useEffect(() => {
        fetch("/api/downloads")
            .then((response) => response.json())
            .then((histories) => {
                setDownloads(histories);
                localStorage.setItem("histories", JSON.stringify(histories));
            })
            .catch(() => {
                const historiesText = localStorage.getItem("histories");
                if (historiesText) {
                    setDownloads(JSON.parse(historiesText));
                }
            });
    }, []);

    const handleDeleteSuccess = () => {
        // Refetch downloads here
        fetch("/api/downloads")
            .then((response) => response.json())
            .then((histories) => {
                setDownloads(histories);
                localStorage.setItem("histories", JSON.stringify(histories));
            })
            .catch((error) => {
                console.error('Error fetching downloads:', error);
            });
    };
    return (
        <main className="container-fluid bg-secondary text-center">
            <table className="table table-warning table-striped-columns">
                <thead className="table-dark">
                <tr>
                    <th>Item</th>
                    <th>FileName</th>
                    <th>Text</th>
                    <th>Uploaded Date&Time</th>
                    <th>Download Times</th>
                    <th>Download Link</th>
                    <th>delete</th>
                </tr>
                </thead>
                <tbody>
                {downloads.length > 0 ? (
                    downloads.map((download, index) => {
                        if (localStorage.getItem("userName") === download.username) {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{download.name}</td>
                                    <td>{download.text}</td>
                                    <td>{download.date}</td>
                                    <td>{download.count}</td>
                                    <td>
                                        <a href="#" onClick={() => handleDownload(download)}>
                                            Download File
                                        </a>
                                    </td>
                                    <td>

                                        <button onClick={() => handleDelete(download,handleDeleteSuccess)}>Delete</button>

                                    </td>

                                </tr>
                            );
                        }
                        return null; // Don't render if the username doesn't match
                    })
                ) : (
                    <tr>
                        <td colSpan={6}>No downloads found</td>
                    </tr>
                )}
                </tbody>
            </table>
        </main>
    );
}
