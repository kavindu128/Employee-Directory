import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-green-900 text-white px-6 py-4 flex justify-between items-center">
    <h1 className="text-xl font-bold">EMPLOYEE DIRECTORY</h1>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">Home</Link>
      <Link to="/login" className="hover:underline">Login</Link>
      <Link to="/signup" className="hover:underline">Sign Up</Link>
    </div>
  </nav>
);

export default Navbar;
