import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/css/index.css";

import { themedSwal } from "./utils/sweetalertTheme";

//Login
import Login from "./pages/Login/Login.jsx";
import MagicLink from "./pages/Login/Acessounico.jsx"
// Layouts
import App from "./pages/Layout/AdminApp.jsx";           // Layout Admin
import DoctorApp from "./pages/Layout/DoctorApp.jsx";
import PatientApp from "./pages/Layout/PatientApp.jsx";
import SecretariaApp from "./pages/Layout/SecretariaApp.jsx";

// Páginas Admin
import Dashboard from "./pages/AdminApp/AdminDashboard/AdminDashboard.jsx";
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
import Roles from "./pages/AdminApp/Roles.jsx";
import DoctorExceptions from "./pages/DoctorExceptions/DoctorExceptions.jsx";
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
import ConsultaEdit from "./pages/DoctorApp/Consultas/ConsultaEdit.jsx";

// paginas do paciente
import PatientDashboard from "./pages/PacienteApp/PatientDashboard.jsx";
import MinhasConsultas from "./pages/PacienteApp/MinhasConsultas.jsx";
import MedicosDisponiveis from "./pages/PacienteApp/MedicosDisponiveis.jsx";
import AgendarConsulta from "./pages/PacienteApp/AgendarConsultas.jsx";
import MeusLaudos from "./pages/PacienteApp/MeusLaudos.jsx";

// Páginas Secretaria
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
import LaudoEdit from "./pages/DoctorApp/Laudos/LaudoEdit.jsx";
import LaudoAdmEdit from "./pages/laudos/LaudoAdmEdit.jsx";
import AgendaDoctor from "./pages/DoctorApp/Agenda/AgendaDoctor.jsx";
import AgendaAdd from "./pages/DoctorApp/Agenda/AgendaAdd.jsx";
import Doctorexceçao from "./pages/DoctorApp/Doctorexceçao.jsx";
import VerLaudo from "./pages/PacienteApp/VerLaudo.jsx";
import MarcarConsulta from "./pages/PacienteApp/MarcarConsulta.jsx";

// Criando o router com todas as rotas
const router = createBrowserRouter([

  // Rotas Login
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/AcessoUnico",
    element: <MagicLink/>
  },

  // Rotas Admin - todas com prefixo /admin/
  {
    path: "/admin",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> }, // Rota inicial do admin
      { path: "dashboard", element: <Dashboard /> },
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
      { path: "agendaedit/:id", element: <AgendaEdit /> },
      { path: "agendalist", element: <AgendaList /> },
      { path: "laudolist", element: <LaudoList /> },
      { path: "laudo", element: <Laudo /> },
      { path: "laudoedit/:id", element: <LaudoAdmEdit /> }, // Rota para editar laudo
      { path: "roles", element: <Roles /> },
      { path: "doctor-exceptions", element: <DoctorExceptions /> },
    ],
  },
  {
    path: "/secretaria",
    element: <SecretariaApp />,
    children: [
      { index: true, element: <SecretariaDashboard /> },
      { path: "secretariaconsultalist", element: <SecretariaConsultaList /> },
      { path: "adicionarconsulta", element: <AdicionarConsulta /> },
      { path: "editarconsulta/:id", element: <EditarConsultas /> },
      { path: "pacientelista", element: <PacienteLista /> },
      { path: "pacienteform", element: <PacienteForm /> },
      { path: "pacienteeditar/:id", element: <PacienteEditar /> },
      { path: "medicoslista", element: <MedicosLista /> },
      { path: "medicosform", element: <MedicosForm /> },
      { path: "medicoseditar/:id", element: <MedicosEditar /> },
      { path: "agendamedica", element: <AgendaMedica /> },
      { path: "adicionaragenda", element: <AdicionarAgenda /> },
      { path: "secretariadashboard", element: <SecretariaDashboard /> },
      { path: "medicosprofile/:id", element: <MedicosProfile /> }
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
      { path: "exceptions", element: <DoctorExceptions /> },
      { path: "patients", element: <DoctorPatientList /> },
      { path: "patientform", element: <DoctorPatientForm /> },
      { path: "consultas", element: <ConsultaList /> },
      { path: "DoctorConsultaForm", element: <DoctorConsultaForm /> },
      { path: "laudolist", element: <LaudoListDoctor /> },
      { path: "laudoform", element: <LaudoFormDoctor /> },
      { path: "laudoedit/:id", element: <LaudoEdit /> }, // Rota para editar laudo
      { path: "prontuariolist", element: <DoctorProntuarioList /> },
      { path: "doctorprontuario/:id", element: <DoctorProntuario /> },
      { path: "doctoragenda", element: <AgendaDoctor /> },
      { path: "doctoragendaadd", element: <AgendaAdd /> },
      { path: "doctorexceçao", element: <Doctorexceçao /> },
      { path: "consultaedit/:id", element: <ConsultaEdit /> },
    ],
  },
  // Rotas Paciente
  {
    path: "/patientapp",
    element: <PatientApp />,
    children: [
      { index: true, element: <PatientDashboard /> },
      { path: "dashboard", element: <PatientDashboard /> },
      { path: "minhasconsultas", element: <MinhasConsultas /> },
      { path: "medicosdisponiveis", element: <MedicosDisponiveis /> },
      { path: "agendarconsulta/:medicoId", element: <AgendarConsulta /> },
      { path: "meuslaudos", element: <MeusLaudos /> },
        { path: "verlaudo/:id", element: <VerLaudo /> },
      { path: "marcarconsulta", element: <MarcarConsulta /> },

    ],
  },
]);

// Tornando o Swal temático disponível globalmente
window.Swal = themedSwal;

// Renderizando a aplicação
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);