import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Patientform from './pages/Patient/Patientform.jsx'
import PatientList from './pages/Patient/PatientList.jsx'
import Doctorlist from './pages/Doctor/DoctorList.jsx'
import DoctorForm from './pages/Doctor/DoctorForm.jsx'
import Doctorschedule from './pages/Schedule/DoctorSchedule.jsx'
import AddSchedule from './pages/Schedule/AddSchedule.jsx'
import Calendar from './pages/calendar/Calendar1.jsx'

const router =createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/patient",
        element: <Patientform />
      },
      {
        path:"/patientlist",
        element: <PatientList />
      },
      {
        path: "/doctorlist",
        element: <Doctorlist />
      },
      {
        path: "/doctorform",
        element: <DoctorForm />
      },
      {
        path: "/doctorschedule",
        element: <Doctorschedule />
      },
      {
        path: "/addschedule",
        element: <AddSchedule />
      },
      {
        path: "/calendar",
        element: <Calendar />
      }
    ]
  }

])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>,
)
