import { FC, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Modal from "../Components/Modal";
import SideExplorer from "../Components/SideExplorer";
import MainItems from "../Components/MainItems";
import { useParams, useLocation } from "react-router-dom";
import { useCurrentLocation, useRecycleBin } from "../Utils/customHooks";

const Home: FC = () => {
    const location = useLocation();
    const { "*": splat } = useParams();
    const { inRecycleBin, setInRecycleBin } = useRecycleBin();
    const { setActivePosition, setCurrentPath } = useCurrentLocation();
    useEffect(() => {
        if (location.pathname === "/recyclebin" && !inRecycleBin) {
            setInRecycleBin(true);
            setActivePosition(0);
            setCurrentPath(["-1"]);
        } else {
            setInRecycleBin(false);
            let path: string[] = splat?.split("/") as string[];
            setActivePosition(path.length - 1);
            setCurrentPath(path);
        }
    }, [splat, location]);
    return (
        <>
            <Navbar />
            <section className="flex">
                <SideExplorer />
                <main className="bg-gray-50 pt-7 w-[74vw] h-[82.5vh] overflow-y-scroll">
                    <MainItems />
                </main>
            </section>
            <Modal />
            <Footer />
        </>
    );
};

export default Home;
