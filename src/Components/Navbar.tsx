import { FC, MouseEvent, Fragment } from "react";
import Logo from "../Assets/file-explorer-logo.png";
import { Link } from "react-router-dom";
import Button from "./Button";
import BreadcrumbButton from "./BreadcrumbButton";
import { useSelector } from "react-redux";
import { MainDataType, ExplorerItemsType, ActiveFolderType, NavbarViewPropType } from "../Utils/interface";
import { FaChevronRight } from "react-icons/fa";
import { BUTTONS, VIEW } from "../Utils/enums";
import { TiHome } from "react-icons/ti";
import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";

const Navbar: FC<NavbarViewPropType> = ({ view, setView }: NavbarViewPropType) => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentPath: ActiveFolderType[] = useSelector((state: MainDataType) => state["currentPath"]);
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <header className="flex">
            <section className="">
                <Link className="-ml-3 -mt-3 -mb-3 pr-8 flex bg-tertiary text-quinary items-center" to="/">
                    <img className="w-[175px]" src={Logo} alt="App Logo" />
                    <div className="flex-col">
                        <h1 className="text-4xl font-black no-underline">File Explorer</h1>
                        <sub className="text-lg align-top float-end">by Devansh</sub>
                    </div>
                </Link>
            </section>
            <section className="ml-5 flex items-center flex-grow">
                {!inRecycleBin ? (
                    <>
                        {currentPath.map((item: ActiveFolderType, index: number) => {
                            return (
                                <Fragment key={item.id}>
                                    {index === 0 && <TiHome className="-mt-1 text-xl mr-1" />}
                                    {currentPath.length - 1 !== index && index !== 0 && <FaChevronRight />}
                                    <BreadcrumbButton name={explorerItems[item.id].name} />
                                </Fragment>
                            );
                        })}
                    </>
                ) : (
                    <div className="text-4xl font-extrabold mt-4">🗑️ Recycle Bin</div>
                )}
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
                        <TbLayoutGrid className={`${view === VIEW.GRID ? "text-quinary" : "text-gray-400"} text-xl`} />
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
                        <TbLayoutList className={`${view === VIEW.LIST ? "text-quinary" : "text-gray-400"} text-xl`} />
                    </button>
                </div>
            </section>
            <section className="flex items-center">
                {!inRecycleBin ? (
                    <>
                        <Button type={BUTTONS.RENAME} />
                        <Button type={BUTTONS.DELETE} />
                    </>
                ) : (
                    <>
                        <Button type={BUTTONS.PERMANENT_DELETE} />
                        <Button type={BUTTONS.EMPTY_BIN} />
                    </>
                )}
            </section>
        </header>
    );
};

export default Navbar;
