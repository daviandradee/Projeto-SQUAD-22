import PatientDashboard from "../pages/PatientApp/PatientDashboard";
import PatientApp from "../pages/PatientApp/PatientApp";

//listas
import LaudoList from "../components/lists/LaudoList";
import ConsultaList from "../components/lists/ConsultaList";

//forms
import MedicosDisponiveis from "../pages/PatientApp/MedicosDisponiveis";
import AgendarConsulta from "../pages/PatientApp/AgendarConsultas";
import VerLaudo from "../components/VerLaudo";


export const PatientRoutes = 
    {
        path: "/paciente",
        element: <PatientApp />,
        children: [
            {index: true, element: <PatientDashboard />},
            {path: "dashboard", element: <PatientDashboard />},
            //listas
            {path: "laudolist", element: <LaudoList />},
            {path: "consultalist", element: <ConsultaList />},
            //forms
            {path: "medicosdisponiveis", element: <MedicosDisponiveis />},
            {path: "agendarconsulta/:medicoId", element: <AgendarConsulta />},
            {path: "verlaudo/:id", element: <VerLaudo />},
        ]
    };
