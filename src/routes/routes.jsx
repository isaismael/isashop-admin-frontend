import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/login";
import { SidebarLayout } from "../layouts/sideBar/index.jsx";
import { sidebarRoutes } from "./sidebar.routes.jsx";

export const router = createBrowserRouter([
    {
        element: <SidebarLayout />,
        children: sidebarRoutes
    },
    {
        path: "/login",
        element: <Login />
    }
]);