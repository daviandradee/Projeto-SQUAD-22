import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { DoctorRoutes } from "./DoctorRoutes";
import { PatientRoutes } from "./PatientRoutes";
import { SecretariaRoutes } from "./SecretariaRoutes";
import Login from "../pages/Login/Login.jsx";
import MagicLink from "../pages/Login/Acessounico.jsx";
import HospitalLanding from "../pages/LandingPage/HospitalLanding.jsx"
import RoomPage from "../components/call/RoomPage.jsx";
import Chat from "../components/chat.jsx";
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
    {
        path: "/call/:roomId",
        element: <RoomPage />
    },
    {
        path: "/chat",
        element: <Chat />
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