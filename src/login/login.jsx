
import React from "react";
import {NavLink} from "react-router-dom";
export function Login() {
  return (
      <main className='container-fluid bg-secondary text-center'>
          <div>login here</div>
          <li><NavLink className="nav-link" to='upload'>Upload</NavLink></li>
        </main>
  );
}