import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">TicketOps</Link>
                <div className="navbar-links">
                    {user ? (
                        <>
                            <span className="navbar-user">Hello, {user.email}</span>
                            <Link to="/" className="nav-item">Dashboard</Link>
                            {user.role === 'admin' && <Link to="/admin" className="nav-item">Admin</Link>}
                            <Link to="/create-ticket" className="nav-item">New Ticket</Link>
                            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-item">Login</Link>
                            <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
