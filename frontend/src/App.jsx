import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './assets/Pages/Home.jsx';
import Login from './assets/Pages/Login.jsx';
import Signup from './assets/Pages/Signup.jsx';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
);

export default App;
