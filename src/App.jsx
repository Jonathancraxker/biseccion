import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clima from './pages/clima.jsx';
import Biseccion from './pages/biseccion.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/clima" element={<Clima />} />
        <Route path="/biseccion" element={<Biseccion />} />
        
        {/* Opcional: Define cuál se ve al entrar a la raíz "/" */}
        <Route path="/" element={<Biseccion />} /> 
      </Routes>
    </Router>
  );
}

export default App;
