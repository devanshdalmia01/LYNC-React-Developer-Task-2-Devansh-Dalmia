import { FC, MouseEvent, useState, useEffect, useRef } from "react";
import { FaFolder, FaCaretDown, FaCaretRight, FaFile } from "react-icons/fa";
import { toast } from "react-toastify";
import { memoizedComputePath, getErrorMessage } from "../Utils/helper";
import { useCurrentLocation, useRecycleBin, useFileFolders, useModal, useSelectedItem } from "../Hooks/hooks";
import { FileFolderType } from "../Types/interface";
import { db } from "../Utils/db";
import { useNavigate } from "react-router-dom";
import { SORT_ORDER, SORT_TYPE, TYPE_FILTER, BUTTONS } from "../Types/enums";
import { Menu, MenuItems, Transition, MenuButton } from "@headlessui/react";
import Button from "./Button";

const SidebarItem: FC<{ currentId: string; isFolder: number }> = ({ currentId, isFolder }) => {
    const navigate = useNavigate();

    // Ref for context menu button
    const menuButton = useRef<HTMLButtonElement>(null);

    // State for context menu x-coordinate, expansion state, item data, and children data
    const [showContextMenuX, setShowContextMenuX] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(isFolder === 1 && true);
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);
    const [itemData, setItemData] = useState<FileFolderType>({
        id: "",
        name: "",
        isFolder: 0,
        parentLineage: "",
        parentId: "",
        lastModifiedTime: new Date(),
        childrenCount: 0,
        size: 0,
    });

    // Hooks
    const { activePosition, currentPath } = useCurrentLocation();
    const { inRecycleBin } = useRecycleBin();
    const { id, setId, setIsFolder, setName } = useSelectedItem();
    const { GetMainData } = useFileFolders();
    const { acceptPressed } = useModal();

    // Fetch item and children data
    useEffect(() => {
        db.filesAndFolders.get(currentId).then((value) => setItemData(value as FileFolderType));
        GetMainData({
            parentId: currentId,
            order: SORT_ORDER.ASCENDING,
            type: TYPE_FILTER.FILE_FOLDER,
            sort: SORT_TYPE.NAME,
        }).then((result) => {
            setChildrenData(result);
        });
    }, [acceptPressed]);

    // Handle context menu opening
    useEffect(() => {
        if (showContextMenuX) {
            menuButton?.current?.click();
        }
    }, [showContextMenuX]);

    return (
        <>
            {/* Context Menu */}
            <Menu>
                <MenuButton
                    ref={menuButton}
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                    }}
                    className="invisible absolute h-0 w-0"
                />
                <Transition
                    enter="transition ease-out duration-75"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <MenuItems
                        anchor={{ gap: showContextMenuX - 10, to: "right start" }}
                        className={`${
                            !inRecycleBin ? "w-28" : "w-40"
                        } h-18 mt-3 shadow-md origin-top-right border-[1px] rounded-md bg-white text-sm/6 text-black [--anchor-gap:var(--spacing-1)]`}
                    >
                        {/* Button for renaming */}
                        <Button type={BUTTONS.RENAME_OPTION_BUTTON} />
                        <div className="border-b-[1px]"></div>
                        {/* Button for deleting */}
                        <Button type={BUTTONS.DELETE_OPTION_BUTTON} />
                    </MenuItems>
                </Transition>
            </Menu>
            {/* Sidebar item */}
            <div
                onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (itemData?.id !== "0") {
                        setShowContextMenuX(e.pageX);
                        setId(itemData?.id);
                        setIsFolder(itemData?.isFolder);
                        setName(itemData?.name);
                    } else {
                        toast.error("You cannot edit Home!", {
                            toastId: "error",
                        });
                    }
                }}
                className={`flex mb-0.5 ${
                    currentPath[activePosition] === currentId && !inRecycleBin
                        ? `bg-primary text-white ${currentId === id && "!border-white"}`
                        : `text-gray-400 ${currentId === id && "!border-primary"}`
                } px-4 mx-2 py-2.5 rounded-xl cursor-pointer items-center border-[1px] border-transparent`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (itemData?.isFolder) {
                        try {
                            let temp: string[] =
                                itemData.parentLineage === "" ? [] : [...itemData.parentLineage.split("/")];
                            navigate(memoizedComputePath(temp.push(itemData.id) - 1, temp));
                        } catch (error) {
                            toast.error(getErrorMessage(error), {
                                toastId: "error",
                            });
                        }
                    } else {
                        toast.error("Opening a file is not supported, yet!", {
                            toastId: "error",
                        });
                    }
                }}
            >
                {/* Folder or File icon */}
                {itemData?.isFolder ? <FaFolder className="mr-2 -mt-1" /> : <FaFile className="mr-2 -mt-1" />}
                <span className="flex-grow">{itemData?.name?.slice(0, 30)}</span>
                {/* Expand/Collapse button */}
                {itemData?.isFolder ? (
                    <button
                        aria-label="expand collapse button"
                        className="cursor-pointer ml-3"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {isExpanded ? (
                            <FaCaretDown className="-mt-1.5 h-[30px] text-xl" />
                        ) : (
                            <FaCaretRight className="-mt-1.5 h-[30px] text-xl" />
                        )}
                    </button>
                ) : (
                    ""
                )}
            </div>
            {/* Render children if expanded */}
            {isExpanded && childrenData.length > 0 ? (
                <>
                    {childrenData.map((item: FileFolderType) => {
                        return (
                            <div key={item.id} className="pl-3">
                                {/* Recursively render children */}
                                <SidebarItem currentId={item.id} isFolder={item.isFolder} />
                            </div>
                        );
                    })}
                </>
            ) : (
                ""
            )}
        </>
    );
};

export default SidebarItem;
