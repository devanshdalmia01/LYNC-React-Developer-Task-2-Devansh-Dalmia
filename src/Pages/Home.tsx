import { FC, useEffect, MouseEvent, lazy } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
const Modal = lazy(() => import("../Components/Modal")); // Lazy loading the Modal component to improve initial load time.
import SideExplorer from "../Components/SideExplorer";
import MainItems from "../Components/MainItems";
import { useParams, useLocation } from "react-router-dom";
import { useCurrentLocation, useRecycleBin, useSelectedItem } from "../Hooks/hooks";

const Home: FC = () => {
    const location = useLocation(); // Hook to access the current URL location object.
    const { "*": splat } = useParams(); // Capture wildcard part of the URL to determine path dynamically.
    const { inRecycleBin, setInRecycleBin } = useRecycleBin(); // Context for recycle bin state.
    const { setActivePosition, setCurrentPath } = useCurrentLocation(); // Context for tracking current path and position in the UI.
    const { setId, setIsFolder, setName } = useSelectedItem(); // Context to manage the selected item state.

    // Effect to update path and state based on the current URL.
    useEffect(() => {
        // Check if the current pathname is specifically the recycle bin and update state accordingly.
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
        setId("");
        setIsFolder(0);
        setName("");
    }, [splat, location]);

    return (
        <>
            <Navbar />
            <section className="flex">
                <SideExplorer />
                <main
                    className="bg-gray-50 pt-5 w-[74vw] h-[82.5vh] overflow-y-scroll"
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation(); // Prevents the event from bubbling up the event chain.
                        e.preventDefault(); // Prevents the default action the browser makes on that event.
                        setId(""); // Reset selected item Id.
                        setIsFolder(0); // Reset isFolder state.
                        setName(""); // Reset selected item name.
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
