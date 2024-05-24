import { useEffect,useState } from "react";
import "./Dashboard.css";

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

    return(
        <>
        <div className="heading">
           <div>
               <center><h3 style={{color:'white'}}>MMDBSS SYSTEM</h3> </center> 
                <h5 style={{ margin: 0}}>Education is Light</h5>
            </div>
            <h4 className="Time">{formattedTime}</h4>
        </div>
        
        </>
    )
}

export default Header;