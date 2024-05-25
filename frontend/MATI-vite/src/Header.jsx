import { useEffect, useState } from "react";
import logo from '../src/assets/logo.jpeg'
import profile from '../src/assets/profile.png'
import "../css/Header.css";

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString();

    return (
        <>
            <div className="heading">
                <div className="left-section">
                    <img src={logo} alt="EduMax Logo" className="logo" />
                    <div className="title-section">
                        <h3 className="h3" style={{ color: 'white' }}>EduMax Hub</h3>
                        <h6 className= "h6"style={{ margin: 0, fontStyle: 'italic' }}>Transforming World of Education Through Technology</h6>
                    </div>
                </div>
                <div className="center-section">
                    <nav className="nav-links">
                        <a href="/dashboard">Dashboard</a>
                        <a href="/students">Student Marks</a>
                        <a href="/courses">Results</a>
                        <a href="/settings">Settings</a>
                    </nav>
                    <div className="search-bar">
                        <input  id="input" type="text" placeholder="Search..." />
                        <button className="btn" type="submit">Search</button>
                    </div>
                </div>
                <div className="right-section">
                    <div className="user-profile">
                        <img src={profile} alt="User Profile" className="profile-pic" />
                        <span className="username">Admin</span>
                        <h4 className="time">{formattedTime}</h4>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;
