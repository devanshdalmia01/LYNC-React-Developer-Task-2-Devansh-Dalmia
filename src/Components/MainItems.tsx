import { FC, useState, MouseEvent, useEffect } from "react";
import { BUTTONS, VIEW } from "../Utils/enums";
import { FaFolder, FaFile } from "react-icons/fa";
import {
    useSelectedItem,
    useCurrentLocation,
    useModal,
    useFileFolders,
    useRecycleBin,
    useViewTypeFilterSort,
} from "../Utils/customHooks";
import { FileFolderType } from "../Utils/interface";
import { toast } from "react-toastify";
import { DoubleClickDiv, computePath, getDate, getFileSize } from "../Utils/common";
import { useNavigate } from "react-router-dom";
import GridButton from "./ViewButton";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { HiDotsVertical } from "react-icons/hi";
import Button from "./Button";

const MainItems: FC = () => {
    const navigate = useNavigate();

    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>();
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);

    const { view, order, sort, typeFilter } = useViewTypeFilterSort();
    const { acceptPressed } = useModal();
    const { inRecycleBin, GetRecycleBinCount } = useRecycleBin();
    const { id, setId, setName, setIsFolder } = useSelectedItem();
    const { activePosition, currentPath } = useCurrentLocation();
    const { GetMainData } = useFileFolders();

    useEffect(() => {
        GetMainData({ parentId: currentPath[activePosition], order: order, sort: sort, type: typeFilter }).then(
            (result) => {
                setChildrenData(result);
            }
        );
        if (!childrenData.length) {
            setId("");
            setName("");
            setIsFolder(0);
        }
    }, [acceptPressed, inRecycleBin, activePosition, currentPath, recycleBinItemCount]);
    useEffect(() => {
        GetRecycleBinCount().then((value) => setRecycleBinItemCount(value));
    }, [acceptPressed, id]);

    const onDoubleClick = (item: { id: string; name: string; isFolder: number }, e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (inRecycleBin) {
            toast.error("Restore to navigate!");
        } else if (item.isFolder) {
            const checkInPath: number = currentPath.findIndex((value) => value === item.id);
            if (checkInPath !== -1) {
                navigate(computePath(checkInPath, currentPath));
            } else {
                let temp = currentPath.slice(0, activePosition + 1);
                navigate(computePath(temp.push(item.id) - 1, temp));
            }
        } else {
            toast.error("Opening a file is not supported, yet!");
        }
    };
    const onSingleClick = (item: { id: string; name: string; isFolder: number }, e: MouseEvent, from?: string) => {
        e.stopPropagation();
        if (item.id === id && !from) {
            setId("");
            setName("");
            setIsFolder(0);
        } else {
            setId(item.id);
            setName(item.name);
            setIsFolder(item.isFolder);
        }
    };

    return !(childrenData.length > 0) ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
            <h1 className="text-3xl font-bold text-primary">No file or folders added!</h1>
        </div>
    ) : (
        <>
            <div className="flex justify-around sticky top-0 mb-7 bg-gray-50">
                <div className="flex w-[96px] justify-between border-[1px] border-gray-400 rounded-full">
                    <GridButton type={VIEW.GRID} />
                    <GridButton type={VIEW.LIST} />
                </div>
            </div>
            <div
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setId("");
                    setIsFolder(0);
                    setName("");
                }}
                className={`ml-10 ${inRecycleBin && "mt-10"} ${
                    view === VIEW.GRID ? "grid grid-cols-5 space-y-reverse space-y-5 pb-5" : "flex flex-col pb-5"
                }`}
            >
                {childrenData.map((item: FileFolderType) => {
                    return (
                        <div className="flex" key={item.id}>
                            <div className="relative right-8 top-4 z-50 h-0 order-2">
                                <Menu>
                                    <MenuButton
                                        onClick={(e: MouseEvent) => {
                                            onSingleClick(item, e, "option");
                                            return;
                                        }}
                                        className="hover:bg-slate-200 p-1 transition ease-out duration-150 rounded-full text-md text-gray-600"
                                    >
                                        <HiDotsVertical />
                                    </MenuButton>
                                    <Transition
                                        enter="transition ease-out duration-75"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <MenuItems
                                            anchor="bottom end"
                                            className={`${
                                                !inRecycleBin ? "w-28" : "w-40"
                                            } h-18 shadow-md origin-top-right border-[1px] rounded-md bg-white text-sm/6 text-black [--anchor-gap:var(--spacing-1)]`}
                                        >
                                            <Button
                                                type={
                                                    !inRecycleBin
                                                        ? BUTTONS.RENAME_OPTION_BUTTON
                                                        : BUTTONS.RESTORE_OPTION_BUTTON
                                                }
                                            />
                                            <div className="border-b-[1px]"></div>
                                            <Button
                                                type={
                                                    !inRecycleBin
                                                        ? BUTTONS.DELETE_OPTION_BUTTON
                                                        : BUTTONS.PERMANENT_DELETE_OPTION_BUTTON
                                                }
                                            />
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>
                            <DoubleClickDiv
                                singleClick={onSingleClick}
                                doubleClick={onDoubleClick}
                                item={item}
                                className={`cursor-pointer order-1 ${
                                    view === VIEW.GRID
                                        ? `shadow-md hover:shadow-none flex flex-col justify-between p-4 bg-white w-40 h-40 rounded-xl ${
                                              id === item.id ? "border-[1px] border-primary" : ""
                                          }`
                                        : `flex items-center py-2 border-t-[1px] w-[96%] pl-4 ${
                                              id === item.id ? "border-[1px] bg-white rounded-md border-primary" : ""
                                          }`
                                }`}
                            >
                                <span>
                                    {item.isFolder ? (
                                        <FaFolder
                                            className={`font-extrabold text-primary ${
                                                view === VIEW.GRID ? "text-4xl" : "text-2xl mr-5"
                                            }`}
                                        />
                                    ) : (
                                        <>
                                            <FaFile
                                                className={`font-extrabold text-primary ${
                                                    view === VIEW.GRID ? "text-4xl" : "text-2xl mr-5"
                                                }`}
                                            />
                                            <span className="font-normal ml-1.5 pt-5 text-sm text-gray-600">
                                                {getFileSize(item.size)}
                                            </span>
                                        </>
                                    )}
                                </span>
                                <span className={`font-extrabold flex flex-col ${view === VIEW.GRID ? "" : "mt-1"}`}>
                                    {view === VIEW.GRID ? item.name?.slice(0, 13) : item.name}
                                    {item.isFolder ? (
                                        <span className="font-light text-xs text-gray-400">
                                            {item.childrenCount} items
                                        </span>
                                    ) : (
                                        <span className="font-light text-xs text-gray-400">
                                            {getDate(item.lastModifiedTime)}
                                        </span>
                                    )}
                                </span>
                            </DoubleClickDiv>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default MainItems;
