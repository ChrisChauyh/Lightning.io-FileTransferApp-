import React from "react";
import { NavLink } from "react-router-dom";

export function Upload() {
    return (
        <main className='container-fluid bg-secondary text-center'>
            <div>upload here</div>
            <li>
                <NavLink className="nav-link" to='/generate'>Generate</NavLink>
            </li>
        </main>
    );
}
