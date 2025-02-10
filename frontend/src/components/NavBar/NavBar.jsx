import React from "react";
import {Link} from "react-router-dom"
import "./NavBar.css"

export const NavBar=()=>{
    return(
        <>
        <div className="navbardiv">
            <Link to="/"><img src="images/Logo.png" alt="" /></Link>
            <ul>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </ul>
        </div>
        </>
    );
}