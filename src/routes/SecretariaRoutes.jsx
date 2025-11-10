import SecretariaApp from "../pages/SecretariaApp/SecretariaApp";
import SecretariaDashboard from "../pages/SecretariaApp/SecretariaDashboard";

import AgendaDoctor from "../components/lists/AgendaDoctor"
import ConsultaList from "../components/lists/ConsultaList";
import DoctorList from "../components/lists/DoctorList";
import PatientList from "../components/lists/PatientList";
//forms
import AgendaForm from "../components/forms/AgendaForm";
import ConsultaForm from "../components/forms/ConsultaForm";
import PatientForm from "../components/forms/PatientForm";

//edits
import PatientEdit from "../components/edits/PatientEdit";
import ConsultaEdit from "../components/edits/ConsultaEdit";

export const SecretariaRoutes = 
    {
        path: "/secretaria",
        element: <SecretariaApp />,
        children: [
            {index: true, element: <SecretariaDashboard />},
            {path: "dashboard", element: <SecretariaDashboard />},
            //listas
            {path: "agendadoctor", element: <AgendaDoctor />},
            {path: "consultalist", element: <ConsultaList />},
            {path: "doctorlist", element: <DoctorList />},
            {path: "patientlist", element: <PatientList />},
            //forms
            {path: "agendaform", element: <AgendaForm />},
            {path: "consultaform", element: <ConsultaForm />},
            {path: "patientform", element: <PatientForm />},
            //edits
            {path: "editpatient/:id", element: <PatientEdit />},
            {path: "editconsulta/:id", element: <ConsultaEdit />},
        ]
    };
