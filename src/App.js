import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from "react";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import {About} from "./about/about";
import {Generate} from "./generate/generate";
import {History} from "./history/history";
import {Explore} from "./explore/explore";
import {Login} from "./login/login";
import {AuthState} from "./login/authState";
import Button from "react-bootstrap/Button";

function Home() {
    if (localStorage.getItem("username") == null) {
        return <Login/>;
    }

    return null; // or return any other component you want to render for authenticated users
}

function logout() {
    fetch(`/api/auth/logout`, {
        method: 'post',
    }).then(() => {
        localStorage.removeItem('userName');
        window.location.href = '';
    });
}

function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem("username") || "");
    const [authState, setAuthState] = React.useState(AuthState.Unknown);


    useEffect(() => {
            if (userName) {
                fetch(`/api/user/${userName}`)
                    .then((res) => {
                        if (res.status === 200) {
                            return res.json();
                        }
                    })
                    .then((user) => {
                        const state = user?.authenticated ? AuthState.Authenticated : AuthState.Unauthenticated;
                        setAuthState(state);
                    })


            } else {
                setAuthState(AuthState.Unauthenticated);
            }
        }
        , [userName]);
    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <h1 className="h1">
                            <a className="nav-link" href="">Lightning.io</a>
                        </h1>
                        <ul className="menu">
                            <li><NavLink className="nav-link" to=''>Home</NavLink></li>
                            <li><NavLink className="nav-link" to='about'>About</NavLink></li>
                            {authState === AuthState.Authenticated && (
                            <li><NavLink className="nav-link" to='history'>Upload history</NavLink></li>
                            )}
                            <li><NavLink className="nav-link" to='explore'>Explore</NavLink></li>

                            {authState === AuthState.Authenticated && (
                                <div id="user-actions">
                                    <div>
                                        <span id="playerName">User: {userName}</span>
                                    </div>
                                    <Button variant="primary" className="register" onClick={() => {
                                        logout();
                                    }
                                    }>Logout</Button>
                                </div>
                            )}
                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path='/' element={
                        <Login userName={userName}
                               authState={authState}
                               onAuthChange={(userName, authState) => {
                                   setUserName(userName);
                                   setAuthState(authState);
                               }}
                        />}
                           exact
                    />
                    <Route path='/about' element={<About/>}/>
                    <Route path='/explore' element={<Explore/>}/>
                    <Route path='/history' element={<History/>}/>
                    <Route path='/generate' element={<Generate/>}/>
                    <Route path='*' element={<NotFound/>}/>
                </Routes>


                <div className="footer">
                    <span className="text-reset">Credit: Chris Chau </span>


                    <a className="text-reset" href="https://github.com/ChrisChauyh/startup">GitHub</a>
                </div>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
    return <h1>404 Not Found</h1>;
}

export default App;
