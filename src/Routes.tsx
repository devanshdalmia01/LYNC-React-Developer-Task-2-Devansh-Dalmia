import { FC } from "react";
import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import MainPage from "./Pages/MainPage";

const Routes: FC = () => {
    return (
        <BrowserRouter>
            <RouterRoutes>
                <Route path="/" element={<MainPage />} />
            </RouterRoutes>
        </BrowserRouter>
    );
};

export default Routes;
