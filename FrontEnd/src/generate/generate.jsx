import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Authenticated} from "../login/authenticated";

export function Generate() {
    const location = useLocation();
    const [imgSrc, setImgSrc] = useState("");


    const [textResult, setTextResult] = useState("");
    const handleDownload = () => {
        // Make a request to the backend download endpoint
        fetch(`download/${localStorage.getItem("fileNameHash")}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // Convert the response to a Blob
            })
            .then(blob => {
                // Create a URL for the Blob object
                const url = URL.createObjectURL(blob);

                // Create a temporary link element to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = localStorage.getItem("localfilename"); // Set the desired filename and extension
                downloadLink.click(); // Simulate a click on the link to trigger the download

                // Clean up the temporary URL object after the download is initiated
                URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, e.g., display an error message to the user
            });
    };

    useEffect(() => {
        const host = window.location.hostname;
        // const port = window.location.port;
        const port = 3000;
        const imgSrc1 = "https://api.qrserver.com/v1/create-qr-code/?data=";
        const imgSrc2 = "&size=200x200";

        const filenameHash = localStorage.getItem("fileNameHash")
        const text = localStorage.getItem("textinput")

        const imgSrc = imgSrc1 + "https://" + host + "/download/" + filenameHash + imgSrc2;

        setImgSrc(imgSrc);
        //setDownloadLink(host + ":" + port + "/download/" + filenameHash);
        if (text != null) {
            setTextResult("This is your text: \n \n" + text);
        }else{
            setTextResult("There is no text");
        }
    }, [location]);

    return (
        <main className="container-fluid bg-secondary text-center">
            <div className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="text-center">
                            <img alt="QR Code" src={imgSrc}/>
                            <br/>
                            <br/>
                            <a href="#" onClick={handleDownload}>
                                Download File
                            </a>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="text-holder">
                            <span className="textresult" id="text-result">{textResult}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Compare this snippet from src\history\history.jsx: