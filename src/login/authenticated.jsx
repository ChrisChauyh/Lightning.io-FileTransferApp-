import React, {useState, useRef} from "react";
import Button from "react-bootstrap/Button";
import {NavLink, useNavigate} from "react-router-dom";
import "./login.css";
import data from "bootstrap/js/src/dom/data";

export function Authenticated(props) {

    const navigate = useNavigate();
    const userName = props.userName;
    const [textareaValue, setTextareaValue] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        localStorage.setItem("localfilename", file.name);
    };
    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setSelectedFile(files[0]);
        localStorage.setItem("localfilename", files[0].name);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        const dropzone = document.getElementById("dropzone");
        dropzone.classList.add("dragover");
    };

    const handleDragLeave = () => {
        const dropzone = document.getElementById("dropzone");
        dropzone.classList.remove("dragover");
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        // Get the textarea element using its ID
        const textareaElement = document.getElementById('text-area');

        // Retrieve the value from the textarea
        const value = textareaElement.value;

        // Update the state variable with the textarea value
        setTextareaValue(value);

        if (selectedFile || textareaValue!=="") {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('email', userName);
            formData.append('filenametext', localStorage.getItem("localfilename"));
            formData.append('textinput', value); // Includes the textarea content

            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    localStorage.setItem("email", data.userName);
                    localStorage.setItem("textinput", value);
                    localStorage.setItem("fileNameHash", data.downloadLink);
                    navigate("/generate");
                })
                .catch((error) => {
                    console.error(error);
                });
        }


    };



    return (
        <div className="form-container">
            <form action="/upload" method="post" encType="multipart/form-data">
                <div className="form-row">
                    <div
                        id="dropzone"
                        className={selectedFile ? "" : "dragover"}
                        onDrop={handleFileDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {!selectedFile && <p>Drag and drop files here or click to select files.</p>}
                        <input
                            type="file"
                            id="fileInput"
                            name="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />
                        {selectedFile && (
                            <div id="file-name">Uploaded file: {selectedFile.name}</div>
                        )}
                    </div>
                    <div className="input-holder">

            <textarea
                name="textinput"
                rows="10"
                className="form-control"
                id="text-area"
                placeholder="Please type any text you want......"
                style={{height: "100px"}}
                wrap="soft"
            ></textarea>
                    </div>
                </div>
                <Button variant="primary" onClick={handleSubmit}>
                    Upload
                </Button>
            </form>
        </div>
    );
}
