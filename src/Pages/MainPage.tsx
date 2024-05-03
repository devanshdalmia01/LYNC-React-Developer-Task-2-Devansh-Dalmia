import { FC, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SideExplorer from "../Components/SideExplorer";
import MainExplorer from "../Components/MainExplorer";
import { VIEW } from "../Utils/enums";
import { SelectedItem } from "../Utils/context";

const MainPage: FC = () => {
    const [view, setView] = useState<VIEW>(VIEW.GRID);
    const [selectedItem, setSelectedItem] = useState<string>("");
    // TODO useMemo in components not dependent on props & states
    // TODO add 0 items messages
    return (
        <SelectedItem.Provider value={{ selectedItem, setSelectedItem }}>
            <Navbar view={view} setView={setView} />
            <section className="flex">
                <SideExplorer />
                <MainExplorer view={view} />
            </section>
            <Footer />
        </SelectedItem.Provider>
    );
};

export default MainPage;
