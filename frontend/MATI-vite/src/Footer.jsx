import "../css/Dashboard.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} MATINYANI MIXED SECONDARY SCHOOL. All rights reserved.</p>
                <p>Contact: info@matinyanischool.edu | +123-456-7890</p>
            </div>
        </footer>
    );
};

export default Footer;
