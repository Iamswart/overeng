import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";

import ErrorPage from "./pages/ErrorPage";
import Payments from "./pages/PaymentsPage";
import ActivationPage from "./pages/ActivationPage"
import VerifyOtpPage from "./pages/VerifyOtpPage";
import QRHandler from "./components/QrHandler";
import WelcomePage from "./pages/WelcomePage";
import SendAmountPage from "./pages/SendAmountPage";
import HomePage from "./pages/HomePage";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {index: true, element: <HomePage />},
            {path:"/merchant", element: <QRHandler/>},
            {path:"/payments", element: <Payments/>},
            {path:"/activate", element: <ActivationPage />},
            {path: "/verify-otp", element: <VerifyOtpPage />},
            {path: "/welcome", element: <WelcomePage />},
            {path: "/amount", element: <SendAmountPage />}
           

           
        ]
    }
])


export default router;