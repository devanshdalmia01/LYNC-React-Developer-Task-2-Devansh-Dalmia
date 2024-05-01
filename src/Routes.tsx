import { BrowserRouter, Route, Routes as RouterRoutes } from "react-router-dom";
import HomePage from "./Pages/HomePage";

export default function Routes() {
    return (
        <BrowserRouter>
            <RouterRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recyclebiin" element={<HomePage />} />
            </RouterRoutes>
        </BrowserRouter>
    );
}
