import {React,useState,useEffect} from "react";
import "./css/dashboard.css"
import Header from "./Header";

const Dashboard = () => {

    return(
        <>
        <div className="">
            <Header/>
        </div>
        <div className="main">
            <div className="sidebar">
                 <center>I am  the sidebar</center>
            </div>

            <div className="main-content">
              
            </div>

        </div>
        <footer className="footer-dashboard">
            <center>I am the footer</center>
        </footer>
        
        </>
    )
}

export default Dashboard