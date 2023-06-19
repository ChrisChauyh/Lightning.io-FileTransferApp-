import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

export function Generate() {
    const location = useLocation();
    const [imgSrc, setImgSrc] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [textResult, setTextResult] = useState("");

    useEffect(() => {
        const host = window.location.hostname;
        const port = window.location.port;
        const imgSrc1 = "https://api.qrserver.com/v1/create-qr-code/?data=";
        const imgSrc2 = "&size=200x200";

        const urlParams = new URLSearchParams(location.search);
        const filenameHash = urlParams.get("value");
        const imgSrc = imgSrc1 + "https://" + host + ":" + port + "/download/" + filenameHash + imgSrc2;

        setImgSrc(imgSrc);
        setDownloadLink("https://" + host + ":" + port + "/download/" + filenameHash);
        if (localStorage.getItem("texts") != null) {
            setTextResult("This is your text: \n \n" + localStorage.getItem("texts"));
        } else {
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
                            <a href={downloadLink}>
                                <button className="btn btn-primary">Download</button>
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