// src/App.jsx
import './assets/css/index.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px" }}>
        {/* Todas as páginas filhas renderizam aqui */}
        <Outlet />
      </div>
    </div>
  )
}

export default App
