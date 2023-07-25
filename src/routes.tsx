import { useRoutes } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import { LibraryAdd } from "@mui/icons-material";

/* PAGES */
import Token from "./pages/Token";
import Tokens from "./pages/Tokens";
import Info from "./pages/Info";
import Admin from "./pages/Admin";
import CreateToken from "./pages/CreateToken";
import StakeToken from "./pages/StakeToken";
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import NotFound from "./pages/NotFound";

export const useNav = () => {
    const menu = [
        {
            path: "/tokens",
            element: <Tokens />,
            title: "Tokens List",
            icon: <ListIcon className="NavIcon" />,
        },
        {
            path: "/create-token",
            element: <CreateToken />,
            title: "Create Token",
            icon: <LibraryAdd className="NavIcon" />,
        },
        // {
        //     path: "/stake-token",
        //     element: <StakeToken />,
        //     title: "Stake",
        //     icon: <BloodtypeIcon className="NavIcon" />,
        // }
    ]

    const routes = [
        {
            path: "/",
            element: <Tokens />,
            title: ""
        },
        ...menu,
        {
            path: "/tokens/:id",
            element: <Token />,
            title: "Token details"
        },
        {
            path: "/admin",
            element: <Admin />,
            title: "Admin Panel"
        },
        /* 404 */
        { 
            path: "*", 
            element: <NotFound />,
            title: "Page Not Found"
        }
    ]

    return {
        menu,
        element: useRoutes(routes),
        routesList: routes
    }
}