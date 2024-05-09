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

const SidebarItem: FC<{ id: string }> = ({ id }) => {
    const navigate = useNavigate();
    const menuButton = useRef<HTMLButtonElement>(null);
    const [showContextMenuX, setShowContextMenuX] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>();
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);
    const { activePosition, currentPath } = useCurrentLocation();
    const { inRecycleBin, GetRecycleBinCount } = useRecycleBin();
    const { setId, setIsFolder, setName } = useSelectedItem();
    const { GetMainData } = useFileFolders();
    const { acceptPressed } = useModal();
    const [itemData, setItemData] = useState<FileFolderType>({
        id: "",
        name: "",
        isExpanded: false,
        isFolder: 0,
        parentLineage: [],
        parentId: "",
        lastModifiedTime: new Date(),
        childrenCount: 0,
        size: 0,
    });
    useEffect(() => {
        db.filesAndFolders.get(id).then((value) => setItemData(value as FileFolderType));
        GetMainData({
            parentId: id,
            order: SORT_ORDER.ASCENDING,
            type: TYPE_FILTER.FILE_FOLDER,
            sort: SORT_TYPE.NAME,
        }).then((result) => {
            setChildrenData(result);
        });
    }, [acceptPressed, inRecycleBin, activePosition, currentPath, recycleBinItemCount, isExpanded]);
    useEffect(() => {
        GetRecycleBinCount().then((value) => setRecycleBinItemCount(value));
    }, [acceptPressed, id]);
    useEffect(() => {
        if (showContextMenuX) {
            menuButton?.current?.click();
        }
    }, [showContextMenuX]);
    useEffect(() => {
        if (showContextMenuX) {
            const id = itemData.id;
            const handleRemoval = () => {
                setId("");
                setIsFolder(0);
                setName("");
                setShowContextMenuX(0);
            };

            const observer = new MutationObserver((mutations: MutationRecord[]) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if ((node as HTMLElement).id === id) {
                            handleRemoval();
                            observer.disconnect();
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            return () => observer.disconnect();
        }
    }, [showContextMenuX]);
    return (
        <>
            <Menu>
                <MenuButton
                    ref={menuButton}
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        return;
                    }}
                    className="invisible h-1 w-1"
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
                        id={id}
                        anchor={{ gap: showContextMenuX - 10, to: "right start" }}
                        className={`${
                            !inRecycleBin ? "w-28" : "w-40"
                        } h-18 mt-3 shadow-md origin-top-right border-[1px] rounded-md bg-white text-sm/6 text-black [--anchor-gap:var(--spacing-1)]`}
                    >
                        <Button type={BUTTONS.RENAME_OPTION_BUTTON} />
                        <div className="border-b-[1px]"></div>
                        <Button type={BUTTONS.DELETE_OPTION_BUTTON} />
                    </MenuItems>
                </Transition>
            </Menu>
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
                        toast.error("You cannot edit Home!");
                    }
                }}
                className={`flex ${
                    currentPath[activePosition] === id && !inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-4 mx-2 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setId("");
                    setIsFolder(0);
                    setName("");
                    if (itemData?.isFolder) {
                        try {
                            let temp: string[] = [...itemData.parentLineage];
                            navigate(memoizedComputePath(temp.push(itemData.id) - 1, temp));
                        } catch (error) {
                            toast.error(getErrorMessage(error));
                        }
                    } else {
                        toast.error("Opening a file is not supported, yet!");
                    }
                    return;
                }}
            >
                {itemData?.isFolder ? <FaFolder className="mr-2 -mt-1" /> : <FaFile className="mr-2 -mt-1" />}
                <span className="flex-grow">{itemData?.name}</span>
                <button
                    aria-label="expand collapse button"
                    className="cursor-pointer"
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (itemData?.isExpanded) {
                            db.filesAndFolders
                                .update(itemData.id, { isExpanded: false })
                                .then(() => setIsExpanded(!isExpanded))
                                .catch((error) => toast.error(getErrorMessage(error)));
                        } else {
                            db.filesAndFolders
                                .update(itemData?.id, { isExpanded: true })
                                .then(() => setIsExpanded(!isExpanded))
                                .catch((error) => toast.error(getErrorMessage(error)));
                        }
                        return;
                    }}
                >
                    {itemData?.isFolder ? (
                        itemData?.isExpanded ? (
                            <FaCaretDown className="-mt-1.5 h-[30px] text-xl" />
                        ) : (
                            <FaCaretRight className="-mt-1.5 h-[30px] text-xl" />
                        )
                    ) : (
                        ""
                    )}
                </button>
            </div>
            <div className="pl-3">
                {itemData?.isExpanded &&
                    childrenData.length > 0 &&
                    childrenData.map((item: FileFolderType) => {
                        return <SidebarItem key={item.id} id={item.id} />;
                    })}
            </div>
        </>
    );
};

export default SidebarItem;
