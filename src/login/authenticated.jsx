import React from "react";
import Button from "react-bootstrap/Button";
import {NavLink, useNavigate} from "react-router-dom";

export function Authenticated(props) {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <form action="/upload" method="post" encType="multipart/form-data">
                <div className="form-row">
                    <div id="dropzone">
                        <p>Drag and drop files here or click to select files.</p>
                        <input type="file" id="fileInput" name="file" />
                        <div id="file-name" name="filename"></div>
                        <input id="playerNameReference" name="email" />
                        <input id="file-namereference" name="filenametext" />
                        <input id="textinputReference" name="textinput" />
                    </div>
                    <div className="input-holder">
            <textarea
                rows="10"
                className="form-control"
                id="text-area"
                placeholder="Please type any text you want......"
                style={{ height: "100px" }} // Fix: use double curly braces to pass a JavaScript object for style
                wrap="soft"
            ></textarea>
                    </div>
                </div>
                <Button variant="primary" type="submit" className="btn btn-primary">
                    Submit
                </Button>
                <NavLink className="nav-link" to='/generate'>Generate</NavLink>
            </form>
        </div>
    );
}


