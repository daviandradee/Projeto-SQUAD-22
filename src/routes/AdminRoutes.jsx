import { AdminApp } from "../pages/AdminApp/AdminApp";
import AdminDashboard from "../pages/AdminApp/AdminDashboard"
import CreateUser from "../pages/AdminApp/CreateUser";
//listas
import AgendaDoctor from "../components/lists/AgendaDoctor"
import ConsultaList from "../components/lists/ConsultaList";
import DoctorList from "../components/lists/DoctorList";
import PatientList from "../components/lists/PatientList";
import LaudoList from "../components/lists/LaudoList";
//forms
import AgendaForm from "../components/forms/AgendaForm";
import ConsultaForm from "../components/forms/ConsultaForm";
import PatientForm from "../components/forms/PatientForm";
import DoctorForm from "../components/forms/DoctorForm";
import LaudoForm from "../components/forms/LaudoForm";
//edits
import DoctorEdit from "../components/edits/DoctorEdit";
import PatientEdit from "../components/edits/PatientEdit";
import ConsultaEdit from "../components/edits/ConsultaEdit";
import LaudoEdit from "../components/edits/LaudoEdit";
import VerLaudo from "../components/VerLaudo";

import Doctorexcecao from "../pages/DoctorApp/Doctorexceçao";
import LaudoConsulta from "../components/LaudoConsulta";


export const AdminRoutes = 
    {
        path: "/admin",
        element: <AdminApp />,
        children: [
            {index: true, element: <AdminDashboard />},
            {path: "dashboard", element: <AdminDashboard />},
        //listas    
        {path: "agendadoctor", element: <AgendaDoctor />},
        {path: "consultalist", element: <ConsultaList />},
        {path: "doctorlist", element: <DoctorList />},
        {path: "patientlist", element: <PatientList />},
        {path: "laudolist", element: <LaudoList />},
        //forms
        {path: "agendaform", element: <AgendaForm />},
        {path: "consultaform", element: <ConsultaForm />},
        {path: "patientform", element: <PatientForm />},
        {path: "doctorform", element: <DoctorForm />},
        {path: "laudoform", element: <LaudoForm />},
        {path: "laudoconsulta", element: <LaudoConsulta />},



        //edits
        {path: "editdoctor/:id", element: <DoctorEdit />},
        {path: "editpatient/:id", element: <PatientEdit />},
        {path: "editconsulta/:id", element: <ConsultaEdit />},
        {path: "editlaudo/:id", element: <LaudoEdit />},
        //create user
        {path: "createuser", element: <CreateUser />},
        {path: "excecao", element: <Doctorexcecao />},
        {path: "verlaudo/:id", element: <VerLaudo />},
    ]
};
