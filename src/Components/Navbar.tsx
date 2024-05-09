import { FC, memo } from "react";
import Logo from "../Assets/file-explorer-logo.webp";
import { Link } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import { useRecycleBin } from "../Hooks/hooks";
import Button from "./Button";
import { BUTTONS } from "../Types/enums";

// Memoized Navbar component to prevent unnecessary re-renders if props and context do not change.
const Navbar: FC = memo(() => {
    // Hook to determine if the current view is the recycle bin.
    const { inRecycleBin } = useRecycleBin();

    return (
        <header className="flex">
            <section>
                {/* Link to the home page, displaying the application logo and name. */}
                <Link className="-ml-3 -mt-3 pr-8 flex bg-secondary text-white items-center" to="/folders/0">
                    <img width="175px" src={Logo} alt="App Logo" />
                    <div>
                        <h1 className="text-4xl font-extrabold">File Explorer</h1>
                        <sub className="text-lg float-end">by Devansh</sub>
                    </div>
                </Link>
            </section>
            <section className="ml-5 flex flex-grow w-[35%] items-center overflow-x-scroll">
                {/* Conditionally display the breadcrumb navigation or recycle bin label based on the context. */}
                {!inRecycleBin ? (
                    <div className="flex items-center">
                        <Breadcrumb />
                    </div>
                ) : (
                    <div className="text-4xl font-extrabold mt-2">🗑️ Recycle Bin</div>
                )}
            </section>
            <section className="flex items-center mr-3 w-[10%]">
                {/* Buttons for actions that change depending on whether the user is in the recycle bin or not. */}
                <div className="flex flex-grow justify-evenly mr-3">
                    <Button type={!inRecycleBin ? BUTTONS.RENAME_BUTTON : BUTTONS.RESTORE_BUTTON} />
                    <Button type={!inRecycleBin ? BUTTONS.DELETE_BUTTON : BUTTONS.PERMANENT_DELETE_BUTTON} />
                </div>
            </section>
            <section className="flex items-center">
                {/* Conditional display of file operation buttons or recycle bin operations. */}
                {!inRecycleBin ? (
                    <>
                        <Button type={BUTTONS.UPLOAD_FILE_BUTTON} />
                        <Button type={BUTTONS.NEW_FOLDER_BUTTON} />
                    </>
                ) : (
                    <Button type={BUTTONS.EMPTY_BIN_BUTTON} />
                )}
            </section>
        </header>
    );
});

export default Navbar;
