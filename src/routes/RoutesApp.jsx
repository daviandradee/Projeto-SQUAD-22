import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { DoctorRoutes } from "./DoctorRoutes";
import { PatientRoutes } from "./PatientRoutes";
import { SecretariaRoutes } from "./SecretariaRoutes";
import Login from "../pages/Login/Login.jsx";
import MagicLink from "../pages/Login/Acessounico.jsx";
import HospitalLanding from "../pages/LandingPage/HospitalLanding.jsx"
export const router = createBrowserRouter([
   
   
   
   
   
     {
        path: "/",
        element: <HospitalLanding />
    },
   
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/AcessoUnico",
        element: <MagicLink />
    },
    // ✅ Se AdminRoutes for função:
    AdminRoutes,
    DoctorRoutes,
    PatientRoutes,
    SecretariaRoutes,
    
    // ✅ OU se AdminRoutes for objeto:
    // AdminRoutes,
    // DoctorRoutes,
    // PatientRoutes,
    // SecretariaRoutes,
]);