import { FC, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SideExplorer from "../Components/SideExplorer";
import MainExplorer from "../Components/MainExplorer";
import { VIEW } from "../Utils/enums";

const MainPage: FC = () => {
    const [view, setView] = useState<VIEW>(VIEW.GRID);
    return (
        <>
            <Navbar view={view} setView={setView} />
            <section className="flex">
                <SideExplorer />
                <MainExplorer view={view} />
            </section>
            <Footer />
        </>
    );
};

export default MainPage;
