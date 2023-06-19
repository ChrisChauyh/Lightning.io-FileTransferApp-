import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { About } from "./about/about";
import { Generate } from "./generate/generate";
import { History } from "./history/history";
import { Upload } from "./upload/upload";
import { Explore } from "./explore/explore";
import { Login } from "./login/login";

function Home() {
    if (localStorage.getItem("username") == null) {
        return <Login />;
    }

    return null; // or return any other component you want to render for authenticated users
}


function App() {
    return (
        <BrowserRouter>
            <div>
                <header>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <h1 className="h1">
                            <a className="nav-link" href="index.html">Lightning.io</a>
                        </h1>
                        <ul className="menu">
                            <li><NavLink className="nav-link" to='/'>Home</NavLink></li>
                            <li><NavLink className="nav-link" to='about'>About</NavLink></li>
                            <li><NavLink className="nav-link" to='history'>Upload history</NavLink></li>
                            <li><NavLink className="nav-link" to='explore'>Explore</NavLink></li>
                            <div id="user-actions">
                                <div id="playerName"></div>
                                <button type="button" className="register" onClick="logout()">
                                    Logout
                                </button>
                            </div>
                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path='/' element={localStorage.getItem("username") != null ? <NotFound /> : <Login />} />
                    <Route path='/index' element={<Home />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/upload' element={<Upload />} />
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/history' element={<History />} />
                    <Route path='/generate' element={<Generate />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>



                <div className="footer">
                    <span className="text-reset">Author: Chris Chau</span>
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
