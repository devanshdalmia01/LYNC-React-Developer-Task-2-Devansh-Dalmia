import { FC, useEffect, MouseEvent, lazy } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
const Modal = lazy(() => import("../Components/Modal"));
import SideExplorer from "../Components/SideExplorer";
import MainItems from "../Components/MainItems";
import { useParams, useLocation } from "react-router-dom";
import { useCurrentLocation, useRecycleBin, useSelectedItem } from "../Hooks/hooks";

const Home: FC = () => {
    const location = useLocation();
    const { "*": splat } = useParams();
    const { inRecycleBin, setInRecycleBin } = useRecycleBin();
    const { setActivePosition, setCurrentPath } = useCurrentLocation();
    const { setId, setIsFolder, setName } = useSelectedItem();
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
                <main
                    className="bg-gray-50 pt-5 w-[74vw] h-[82.5vh] overflow-y-scroll"
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setId("");
                        setIsFolder(0);
                        setName("");
                        return;
                    }}
                >
                    <MainItems />
                </main>
            </section>
            <Modal />
            <Footer />
        </>
    );
};

export default Home;
