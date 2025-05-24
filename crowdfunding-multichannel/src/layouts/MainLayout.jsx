import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
    const location = useLocation();

    const isReportPage = location.pathname === "/report";

    return (
        <div className="app">
        <Header />
        <div className={`${isReportPage ? "container" : "container-mobile p-4"}`}>
            <div className="app-wrapper">
            <Outlet />
            </div>
        </div>
        </div>
    );
};

export default MainLayout;
