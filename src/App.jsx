import './assets/css/index.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'

function App() {
  return(
    <div>
      <Navbar />
      <Sidebar />
      <Outlet />
    </div>
  )
}

  

export default App
