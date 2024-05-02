import Logo from "../Assets/file-explorer-logo.webp";
import { Link } from "react-router-dom";
import Button from "./Button";
import BreadcrumbButton from "./BreadcrumbButton";
import { useSelector } from "react-redux";
import { MainDataType, ExplorerItemsType } from "../Utils/interface";
import { FaChevronRight } from "react-icons/fa";

const Navbar = () => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentLocation: string[] = useSelector((state: MainDataType) => state["currentLocation"]);
    return (
        <header className="flex m-5">
            <section className="mr-10">
                <Link className="flex items-center" to="/">
                    <img className="w-[120px] rounded-full mr-5" src={Logo} alt="App Logo" />
                    <div className="flex-col">
                        <h1 className="text-4xl font-black no-underline">File Explorer</h1>
                        <sub className="text-lg align-top float-end">by Devansh</sub>
                    </div>
                </Link>
            </section>
            <section className="flex items-center">
                {currentLocation.map((item: string, index: number) => {
                    return (
                        <div className="flex items-center" key={index}>
                            <BreadcrumbButton name={explorerItems[item].name} />
                            {currentLocation.length - 1 !== index && <FaChevronRight />}
                        </div>
                    );
                })}
            </section>
            <section className="operations">
                <Button />
                <Button />
            </section>
        </header>
    );
};

export default Navbar;
