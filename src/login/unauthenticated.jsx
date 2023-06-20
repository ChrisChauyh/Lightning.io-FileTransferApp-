import {useState} from "react";
import Button from "react-bootstrap/Button";
import {MessageDialog} from "./messageDialog";

export function Unauthenticated(props){
    const [userName, setUserName] = useState(props.userName);
    const [password, setPassword] = useState("");
    const [showMessageDialog, setShowMessageDialog] = useState(null);
    async function loginUser() {
        await loginOrCreate(`/api/auth/login`);
    }
    async function createUser() {
        await loginOrCreate(`/api/auth/create`);
    }
    function logout() {
        fetch(`/api/auth/logout`, {
            method: 'delete',
        }).then(() => {
            localStorage.removeItem('userName');
            props.onlogout();
        });
    }
    async function loginOrCreate(endpoint) {
        const userName = document.querySelector('#userName')?.value;
        const password = document.querySelector('#userPassword')?.value;
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({ email: userName, password: password }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (response?.status === 200) {
            localStorage.setItem('userName', userName);
            props.onlogin(userName);
        } else {
            const body = await response.json();
            setShowMessageDialog( `⚠ Error: ${body.msg}`);
        }
    }
    return (
        <div className="login">

            <div id="loginControls" className="login-container">
                <div className="input-group">
                    <span className="input-group-text">👤</span>
                    <input className="form-control" type="text" id="userName" placeholder="Username"/>
                </div>
                <div className="input-group">
                    <span className="input-group-text">🔒</span>
                    <input className="form-control" type="password" id="userPassword" placeholder="Password"/>
                </div>
                <div className="modal-body"></div>
                <div className="button-group">
                    <Button variant="primary" onClick={loginUser}>Login</Button>
                    <Button variant="secondary" onClick={createUser}>Create</Button>
                </div>
                <MessageDialog message={showMessageDialog} onHide={() => setShowMessageDialog(null)}/>
            </div>
        </div>
    )
}