import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-green-900 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">EMPLOYEE DIRECTORY</h1>
      <div className="space-x-4">
        <Link to="/home" className="hover:underline">Home</Link>
        {!user ? (
          <>
            <Link to="/" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="hover:underline cursor-pointer">Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
