import { FC } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import SideExplorer from "../Components/SideExplorer";
import MainExplorer from "../Components/MainExplorer";

const MainPage: FC = () => {
    return (
        <>
            <Navbar />
            <section className="flex">
                <SideExplorer />
                <MainExplorer />
            </section>
            <Footer />
        </>
    );
};

export default MainPage;
