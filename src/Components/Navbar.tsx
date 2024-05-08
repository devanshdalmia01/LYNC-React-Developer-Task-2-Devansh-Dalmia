import { FC } from "react";
import Logo from "../Assets/file-explorer-logo.webp";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useRecycleBin } from "../Utils/customHooks";
import Button from "./Button";
import { BUTTONS } from "../Utils/enums";

const Navbar: FC = () => {
    const { inRecycleBin } = useRecycleBin();
    return (
        <header className="flex">
            <section>
                <Link className="-ml-3 -mt-3 pr-8 flex bg-secondary text-white items-center" to="/">
                    <img className="w-[175px]" src={Logo} alt="App Logo" />
                    <div>
                        <h1 className="text-4xl font-extrabold">File Explorer</h1>
                        <sub className="text-lg float-end">by Devansh</sub>
                    </div>
                </Link>
            </section>
            <section className="ml-5 flex flex-grow w-[22%] items-center overflow-x-scroll">
                {!inRecycleBin ? (
                    <div className="flex items-center">
                        <Breadcrumb />
                    </div>
                ) : (
                    <div className="text-4xl font-extrabold mt-2">🗑️ Recycle Bin</div>
                )}
            </section>
            <section className="flex items-center mr-3 w-[10%]">
                <div className="flex flex-grow justify-evenly mr-3">
                    <Button type={!inRecycleBin ? BUTTONS.RENAME_BUTTON : BUTTONS.RESTORE_BUTTON} />
                    <Button type={!inRecycleBin ? BUTTONS.DELETE_BUTTON : BUTTONS.PERMANENT_DELETE_BUTTON} />
                </div>
            </section>
            <section className="flex items-center">
                {!inRecycleBin ? (
                    <>
                        <Button type={BUTTONS.UPLOAD_FILE_BUTTON} />
                        <Button type={BUTTONS.NEW_FILE_BUTTON} />
                        <Button type={BUTTONS.NEW_FOLDER_BUTTON} />
                    </>
                ) : (
                    <Button type={BUTTONS.EMPTY_BIN_BUTTON} />
                )}
            </section>
        </header>
    );
};

export default Navbar;
