import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import NotFoundPage from "./Pages/NotFoundPage";
import { Navigate } from "react-router-dom";

const AppRoutes: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/folders/0" />} />
                <Route path="/recyclebin" element={<Home />} />
                <Route path="/folders" element={<Navigate replace to="/folders/0" />} />
                <Route path="/folders/*" element={<Home />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
