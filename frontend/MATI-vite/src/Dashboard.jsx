import "../css/Dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Body from "./Body";
import Footer from "./Footer";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {

    const [selectedItem , setSelectedItem] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const handleItemOnClick = (item) =>{
        setSelectedItem(item);
    }

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return(
        <>
        <div className="">
            <Header/>
        </div>
        <div className="Body">
          <div className="Sidebar" >
          <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
            </button>
               <Sidebar onItemClick = {handleItemOnClick} collapsed={collapsed} />
            </div> 
           <div className="body">
                <Body selectedItem = {selectedItem}/>
           </div>
        </div>
        <div className="Footer">
            <Footer/>
        </div>
        </>
    )
}

export default Dashboard