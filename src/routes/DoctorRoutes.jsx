import DoctorDashBoard from "../pages/DoctorApp/DoctorDashboard";
import DoctorApp from "../pages/DoctorApp/DoctorApp";
import DoctorProntuario from "../pages/DoctorApp/Prontuario/DoctorProntuario";
import DoctorProntuarioList from "../pages/DoctorApp/Prontuario/DoctorProntuarioList"
import DoctorCalendar from "../pages/DoctorApp/DoctorCalendar";
import Doctorexeceçao from "../pages/DoctorApp/Doctorexceçao";

import AgendaDoctor from "../components/lists/AgendaDoctor"
import ConsultaList from "../components/lists/ConsultaList";
import PatientList from "../components/lists/PatientList";
import LaudoList from "../components/lists/LaudoList";
//forms
import AgendaForm from "../components/forms/AgendaForm";
import ConsultaForm from "../components/forms/ConsultaForm";
import LaudoForm from "../components/forms/LaudoForm";
//edits
import ConsultaEdit from "../components/edits/ConsultaEdit";
import LaudoEdit from "../components/edits/LaudoEdit";
import VerLaudo from "../components/VerLaudo";

export const DoctorRoutes = 
    {path : "/medico",
    element: <DoctorApp />,
    children: [
        {index: true, element: <DoctorDashBoard />},
        {path: "dashboard", element: <DoctorDashBoard />},
        {path: "prontuario", element: <DoctorProntuario />},
        {path: "prontuariolist", element: <DoctorProntuarioList />},
        {path: "calendar", element: <DoctorCalendar />},
        {path: "excecao", element: <Doctorexeceçao />},
        //listas
        {path: "agendadoctor", element: <AgendaDoctor />},
        {path: "consultalist", element: <ConsultaList />},
        {path: "patientlist", element: <PatientList />},
        {path: "laudolist", element: <LaudoList />},
        //forms
        {path: "agendaform", element: <AgendaForm />},
        {path: "consultaform", element: <ConsultaForm />},
        {path: "laudoform", element: <LaudoForm />},
        //edits
        {path: "editconsulta/:id", element: <ConsultaEdit />},
        {path: "editlaudo/:id", element: <LaudoEdit />},
        {path: "verlaudo/:id", element: <VerLaudo />},
    
    ]
};