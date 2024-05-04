import { FC, MouseEvent, ReactElement } from "react";
import Logo from "../Assets/file-explorer-logo.webp";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useSelector, useDispatch } from "react-redux";
import { MainDataType, ExplorerItemsType, ActiveFolderType, NavbarViewPropType } from "../Utils/interface";
import { FaChevronRight } from "react-icons/fa";
import { BUTTONS, VIEW } from "../Utils/enums";
import { TiHome } from "react-icons/ti";
import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";
import { GoToPreviousFolder, ChangeRootFolder } from "../redux/storingData";

const Navbar: FC<NavbarViewPropType> = ({ view, setView }: NavbarViewPropType) => {
    const dispatch = useDispatch();
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentPath: ActiveFolderType[] = useSelector((state: MainDataType) => state["currentPath"]);
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    const elements: ReactElement[] = [];
    for (let index: number = 0; index < currentPath.length; index++) {
        const item: ActiveFolderType = currentPath[index];
        elements.push(
            <div
                key={index}
                className="flex items-center"
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (index === 0) {
                        dispatch(ChangeRootFolder({ openRecycleBin: false }));
                    } else if (index < currentPath.length) {
                        for (let i = 0; i < currentPath.length - 1 - index; i++) {
                            dispatch(GoToPreviousFolder());
                        }
                    }
                    return;
                }}
            >
                {index === 0 && <TiHome className="-mt-1 text-2xl mr-1.5" />}
                {!(index === 0) && <FaChevronRight className="mx-[4px]" />}
                <button className="text-2xl font-semibold">{explorerItems[item.id].name.slice(0, 5)}</button>
            </div>
        );

        if (item.isActive) break;
    }
    return (
        <header className="flex">
            <section className="">
                <Link className="-ml-3 -mt-3 -mb-3 pr-8 flex bg-secondary text-white items-center" to="/">
                    <img className="w-[175px]" src={Logo} alt="App Logo" />
                    <div className="flex-col">
                        <h1 className="text-4xl font-black no-underline">File Explorer</h1>
                        <sub className="text-lg align-top float-end">by Devansh</sub>
                    </div>
                </Link>
            </section>
            <section className="ml-5 flex items-center flex-grow">
                {!inRecycleBin ? elements : <div className="text-4xl font-extrabold mt-4">🗑️ Recycle Bin</div>}
            </section>
            <section className="flex items-center mr-10 w-[92px]">
                <div className="flex justify-between border-[1px] border-gray-400 rounded-full w-full">
                    <button
                        className={`w-[46px] focus:outline-none h-[46px] flex items-center justify-center rounded-full ${
                            view === VIEW.GRID && "bg-primary"
                        }`}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            setView(VIEW.GRID);
                            return;
                        }}
                    >
                        <TbLayoutGrid className={`${view === VIEW.GRID ? "text-white" : "text-gray-400"} text-xl`} />
                    </button>
                    <button
                        className={`w-[46px] focus:outline-none h-[46px] flex items-center justify-center rounded-full ${
                            view === VIEW.LIST && "bg-primary"
                        }`}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            setView(VIEW.LIST);
                            return;
                        }}
                    >
                        <TbLayoutList className={`${view === VIEW.LIST ? "text-white" : "text-gray-400"} text-xl`} />
                    </button>
                </div>
            </section>
            <section className="flex items-center">
                {!inRecycleBin ? (
                    <>
                        <Button type={BUTTONS.ADD_FILE} />
                        <Button type={BUTTONS.ADD_FOLDER} />
                    </>
                ) : (
                    <>
                        <Button type={BUTTONS.RESTORE} />
                        <Button type={BUTTONS.PERMANENT_DELETE} />
                        <Button type={BUTTONS.EMPTY_BIN} />
                    </>
                )}
            </section>
        </header>
    );
};

export default Navbar;
