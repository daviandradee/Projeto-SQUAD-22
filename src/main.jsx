import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/css/index.css";

//Login
import Login from "./pages/Login/Login.jsx";

// Layouts
import App from "./pages/Layout/AdminApp.jsx";           // Layout Admin
import DoctorApp from "./pages/Layout/DoctorApp.jsx"; 
import PatientApp from "./pages/Layout/PatientApp.jsx";
import SecretariaApp from "./pages/Layout/SecretariaApp.jsx";

// Páginas Admin
import Patientform from "./pages/AdminApp/Patient/Patientform.jsx";
import PatientList from "./pages/AdminApp/Patient/PatientList.jsx";
import Doctorlist from "./pages/AdminApp/Doctor/DoctorList.jsx";
import DoctorForm from "./pages/AdminApp/Doctor/DoctorForm.jsx";
import Doctorschedule from "./pages/AdminApp/Schedule/DoctorSchedule.jsx";
import AddSchedule from "./pages/AdminApp/Schedule/AddSchedule.jsx";
import Calendar from "./pages/AdminApp/calendar/Calendar.jsx";
import EditDoctor from "./pages/AdminApp/Doctor/DoctorEdit.jsx";
import PatientEdit from "./pages/AdminApp/Patient/PatientEdit.jsx";
import DoctorProfile from "./pages/AdminApp/Doctor/DoctorProfile.jsx";

// paginas secretaria

import SecretariaConsultaList from "./pages/SecretariaApp/Consultas/ConsultasList.jsx"
import AdicionarConsulta from "./pages/SecretariaApp/Consultas/AdicionarConsulta.jsx";

// Páginas Médico
import DoctorDashboard from "./pages/DoctorApp/DoctorDashboard.jsx";
import DoctorCalendar from "./pages/DoctorApp/DoctorCalendar.jsx";
import DoctorPatientList from "./pages/DoctorApp/Patient/DoctorPatientList.jsx";
import DoctorPatientForm from "./pages/DoctorApp/Patient/DoctorPatientForm.jsx";
import ConsultaList from "./pages/DoctorApp/Consultas/ConsultaList.jsx";
import DoctorConsultaForm from "./pages/DoctorApp/Consultas/DoctorConsultaForm.jsx";
import LaudoListDoctor from "./pages/DoctorApp/Laudos/Laudo.jsx";
import LaudoFormDoctor from "./pages/DoctorApp/Laudos/LaudoForm.jsx";
import AgendaList from "./pages/AdminApp/Agendar/AgendaList.jsx";
import AgendaForm from "./pages/AdminApp/Agendar/AgendaForm.jsx";
import AgendaEdit from "./pages/AdminApp/Agendar/AgendaEdit.jsx";
import LaudoList from "./pages/laudos/LaudosList.jsx"
import Laudo from "./pages/laudos/Laudo.jsx";
import DoctorProntuarioList from "./pages/DoctorApp/DoctorProntuarioList.jsx";
import DoctorProntuario from "./pages/DoctorApp/DoctorProntuario.jsx";

// paginas do paciente
import PatientDashboard from "./pages/PacienteApp/PatientDashboard.jsx";
import MeusExames from "./pages/PacienteApp/Exames.jsx";
import MinhasConsultas from "./pages/PacienteApp/MinhasConsultas.jsx";

//

import PacienteLista from "./pages/SecretariaApp/Pacientes/PacienteLista.jsx";
import PacienteForm from "./pages/SecretariaApp/Pacientes/PacienteForm.jsx";
import PacienteEditar from "./pages/SecretariaApp/Pacientes/PacienteEditar.jsx";
import MedicosLista from "./pages/SecretariaApp/Medicos/MedicosLista.jsx";
import MedicosForm from "./pages/SecretariaApp/Medicos/MedicosForm.jsx";
import MedicosProfile from "./pages/SecretariaApp/Medicos/MedicosProfile.jsx";
import MedicosEditar from "./pages/SecretariaApp/Medicos/MedicosEditar.jsx";
import EditarConsultas from "./pages/SecretariaApp/Consultas/EditarConsultas.jsx";
import AgendaMedica from "./pages/SecretariaApp/Agenda/Agendamedica.jsx";
import AdicionarAgenda from "./pages/SecretariaApp/Agenda/AdicionarAgenda.jsx";
import SecretariaDashboard from "./pages/SecretariaApp/SecretariaDashboard.jsx";





// Criando o router com todas as rotas
const router = createBrowserRouter([
   
  // Rotas Admin
  { 
path: "/",
element: <Login />

  },
  
  // Rotas Admin - todas com prefixo /admin/
  {
    path: "/admin",
    element: <App />,
    children: [
      { index: true, element: <Doctorlist /> }, // Rota inicial do admin
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
   {
    path: "/secretaria",
    element: <SecretariaApp />,
    children: [
      { index: true, element: <SecretariaDashboard/> },
      { path: "secretariaconsultalist", element: <SecretariaConsultaList/>},
      { path: "adicionarconsulta", element: <AdicionarConsulta/>},
      { path: "editarconsulta/:id", element: <EditarConsultas/>},
      { path: "pacientelista", element: <PacienteLista/>},
      { path: "pacienteform", element: <PacienteForm/>},
      { path: "pacienteeditar/:id", element: <PacienteEditar/>},
      { path: "medicoslista", element: <MedicosLista/>},
      { path: "medicosform", element: <MedicosForm/>},
      { path: "medicoseditar/:id", element: <MedicosEditar/>},
      { path: "agendamedica", element: <AgendaMedica/>},
      { path: "adicionaragenda", element: <AdicionarAgenda/>},
      { path: "secretariadashboard", element: <SecretariaDashboard/>},
      { path: "medicosprofile/:id", element: <MedicosProfile/>}
      // Rota inicial do admin
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
      { path: "patientform", element: <DoctorPatientForm /> },
      {path: "consultas", element: <ConsultaList /> },
      { path: "DoctorConsultaForm", element: <DoctorConsultaForm/> },
      {path: "laudolist", element: <LaudoListDoctor /> },
      {path: "laudoform", element: <LaudoFormDoctor /> },
       { path: "prontuariolist", element: <DoctorProntuarioList /> }, // :white_check_mark: Rota corrigida
      { path: "doctorprontuario/:id", element: <DoctorProntuario /> }// Nova rota para DoctorProntuario
    ],
  },
  // Rotas Paciente
  {
    path: "/patientapp",
    element: <PatientApp />,
    children: [
      { index: true, element: <PatientDashboard/> }, 
      {path: "dashboard", element: <PatientDashboard />},
      {path: "meuexame", element: <MeusExames />},
      {path: "minhasconsultas", element: <MinhasConsultas/>},
      // Rota inicial médico
      

    ],
  },
]);

// Renderizando a aplicação
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);