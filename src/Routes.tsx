import { FC } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import NotFoundPage from "./Pages/NotFoundPage";

// Functional Component for setting up the main routes in the application.
const AppRoutes: FC = () => {
    return (
        // Browser Router to use HTML5 history API and keep UI in sync with the URL.
        <BrowserRouter>
            <Routes>
                {/* Default route that redirects to the base folder view */}
                <Route path="/" element={<Navigate replace to="/folders/0" />} />

                {/* Route for the Recycle Bin view */}
                <Route path="/recyclebin" element={<Home />} />

                {/* General route for folders which redirects to a default folder (Id 0) */}
                <Route path="/folders" element={<Navigate replace to="/folders/0" />} />

                {/* Route for viewing different folders, uses dynamic segment to represent folder Id */}
                <Route path="/folders/*" element={<Home />} />

                {/* Fallback route for any non-defined URLs, showing a 404 not found page */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
