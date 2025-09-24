import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/css/index.css";

//Login
import Login from "./pages/Login/Login.jsx";

// Layouts
import App from "./pages/Layout/SecratariaGApp.jsx";           // Layout Admin
import DoctorApp from "./pages/Layout/DoctorApp.jsx"; // Layout Médico

// Páginas Admin
import Patientform from "./pages/Patient/Patientform.jsx";
import PatientList from "./pages/Patient/PatientList.jsx";
import Doctorlist from "./pages/Secretaria Geral/Doctor/DoctorList.jsx";
import DoctorForm from "./pages/Secretaria Geral/Doctor/DoctorForm.jsx";
import Doctorschedule from "./pages/Schedule/DoctorSchedule.jsx";
import AddSchedule from "./pages/Schedule/AddSchedule.jsx";
import Calendar from "./pages/Secretaria Geral/calendar/Calendar.jsx";
import EditDoctor from "./pages/Secretaria Geral/Doctor/DoctorEdit.jsx";
import PatientEdit from "./pages/Patient/PatientEdit.jsx";
import DoctorProfile from "./pages/Secretaria Geral/Doctor/DoctorProfile.jsx";


// Páginas Médico
import DoctorDashboard from "./pages/DoctorApp/DoctorDashboard.jsx";
import DoctorCalendar from "./pages/DoctorApp/DoctorCalendar.jsx";
import DoctorPatientList from "./pages/DoctorApp/Patient/DoctorPatientList.jsx";
import ConsultaList from "./pages/DoctorApp/Consultas/ConsultaList.jsx";
import LaudoListDoctor from "./pages/DoctorApp/Laudos/Laudo.jsx";
import LaudoFormDoctor from "./pages/DoctorApp/Laudos/LaudoForm.jsx";
import AgendaList from "./pages/Secretaria Geral/Agendar/AgendaList.jsx";
import AgendaForm from "./pages/Secretaria Geral/Agendar/AgendaForm.jsx";
import AgendaEdit from "./pages/Secretaria Geral/Agendar/AgendaEdit.jsx";
import LaudoList from "./pages/laudos/LaudosList.jsx"
import Laudo from "./pages/laudos/Laudo.jsx";




// Criando o router com todas as rotas
const router = createBrowserRouter([
   
  // Rotas Admin
  { 
path: "/",
element: <Login />

  },
  
  {
    path: "/",
    element: <App />,
    children: [
      // Rota inicial do Admin: apenas mostra layout com Navbar e Sidebar
      { path: "patient", element: <Patientform /> },
      { path: "patientlist", element: <PatientList /> },
      { path: "doctorlist", element: <Doctorlist /> },
      { path: "doctorform", element: <DoctorForm /> },
      { path: "doctorschedule", element: <Doctorschedule /> },
      { path: "addschedule", element: <AddSchedule /> },
      { path: "calendar", element: <Calendar /> },
      { path: "profiledoctor/:id", element: <DoctorProfile /> },
      { path: "editdoctor/:id", element: <EditDoctor /> },
      { path: "editpatient/:id", element: <PatientEdit /> },
      { path: "agendaform", element: <AgendaForm />},
      { path: "agendaedit", element: <AgendaEdit />},
      { path: "agendalist", element: <AgendaList />},
      { path: "laudolist", element: <LaudoList /> },
      { path: "laudo", element: <Laudo />}
    ],
  },
  // Rotas Médico
  {
    path: "/doctor",
    element: <DoctorApp />,
    children: [
      { index: true, element: <DoctorDashboard /> }, // Rota inicial médico
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "calendar", element: <DoctorCalendar /> },
      { path: "patients", element: <DoctorPatientList /> },
      {path: "consultas", element: <ConsultaList /> },
      {path: "laudolist", element: <LaudoListDoctor /> },
      {path: "laudoform", element: <LaudoFormDoctor /> },

    ],
  },
]);

// Renderizando a aplicação
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
