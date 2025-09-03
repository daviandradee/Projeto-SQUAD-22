import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import App from "./App.jsx";
import DoctorApp from "./pages/DoctorApp/DoctorApp.jsx"; // layout do Médico
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Admin
import Patientform from "./pages/Patient/Patientform.jsx";
import PatientList from "./pages/Patient/PatientList.jsx";
import Doctorlist from "./pages/Doctor/DoctorList.jsx";
import DoctorForm from "./pages/Doctor/DoctorForm.jsx";
import Doctorschedule from "./pages/Schedule/DoctorSchedule.jsx";
import AddSchedule from "./pages/Schedule/AddSchedule.jsx";
import Calendar from "./pages/calendar/Calendar1.jsx";

// Médico
import DoctorCalendar from "./pages/DoctorApp/DoctorCalendar.jsx";
import DoctorDashboard from "./pages/DoctorApp/DoctorDashboard.jsx";
import DoctorPatientList from "./pages/DoctorApp/DoctorPatientList.jsx";
import DoctorProfile from "./pages/Doctor/DoctorProfile.jsx";

const router = createBrowserRouter([
  // Rotas do Admin
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/patient", element: <Patientform /> },
      { path: "/patientlist", element: <PatientList /> },
      { path: "/doctorlist", element: <Doctorlist /> },
      { path: "/doctorform", element: <DoctorForm /> },
      { path: "/doctorschedule", element: <Doctorschedule /> },
      { path: "/addschedule", element: <AddSchedule /> },
      { path: "/calendar", element: <Calendar /> },
      { path: "/profiledoctor/:id", element: <DoctorProfile />},
    ],
  },

  // Rotas do Médico
  {
    path: "/doctor",
    element: <DoctorApp />,
    children: [
      { path: "dashboard", element: <DoctorDashboard /> }, // 👈 Dashboard com gráficos/dados
      { path: "calendar", element: <DoctorCalendar /> },   // 👈 Calendário centralizado
      { path: "patients", element: <DoctorPatientList /> } // 👈 Lista de pacientes com laudo/receita
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

