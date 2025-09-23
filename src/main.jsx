import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/css/index.css";

// Layouts
import App from "./App.jsx";
import DoctorApp from "./pages/DoctorApp/DoctorApp.jsx";

// Página de Login
import Login from "./pages/Login/Login.jsx";

import SecretariaDashboard from "./pages/Secretaria/SecretariaDashboard.jsx";
// Páginas Admin
import Patientform from "./pages/Patient/Patientform.jsx";
import PatientList from "./pages/Patient/PatientList.jsx";
import Doctorlist from "./pages/Doctor/DoctorList.jsx";
import DoctorForm from "./pages/Doctor/DoctorForm.jsx";
import Doctorschedule from "./pages/Schedule/DoctorSchedule.jsx";
import AddSchedule from "./pages/Schedule/AddSchedule.jsx";
import Calendar from "./pages/calendar/Calendar.jsx";
import EditDoctor from "./pages/Doctor/DoctorEdit.jsx";
import PatientEdit from "./pages/Patient/PatientEdit.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";
import AgendaList from "./pages/Agendar/AgendaList.jsx";
import AgendaForm from "./pages/Agendar/AgendaForm.jsx";
import AgendaEdit from "./pages/Agendar/AgendaEdit.jsx";
import LaudoList from "./pages/laudos/LaudosList.jsx";
import Laudo from "./pages/laudos/Laudo.jsx";

// Páginas Médico
import DoctorDashboard from "./pages/DoctorApp/DoctorDashboard.jsx";
import DoctorCalendar from "./pages/DoctorApp/DoctorCalendar.jsx";
import DoctorPatientList from "./pages/DoctorApp/DoctorPatientList.jsx";

// Router
const router = createBrowserRouter([
  // Primeira tela = Login
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/secretaria",
    element: <SecretariaDashboard />,
  },
  
  {
    path: "/",
    element: <App />,
    children: [
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
      { path: "agendaform", element: <AgendaForm /> },
      { path: "agendaedit", element: <AgendaEdit /> },
      { path: "agendalist", element: <AgendaList /> },
      { path: "laudolist", element: <LaudoList /> },
      { path: "laudo", element: <Laudo /> },
    ],
  },

  // Rotas Médico
  {
    path: "/doctor",
    element: <DoctorApp />,
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "dashboard", element: <DoctorDashboard /> },
      { path: "calendar", element: <DoctorCalendar /> },
      { path: "patients", element: <DoctorPatientList /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
