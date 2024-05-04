import { FC, MouseEvent } from "react";
import { FileFolderPropType } from "../Utils/interface";
import SidebarFile from "./SidebarFile";
import { ExplorerItemsType, MainDataType, ActiveFolderType } from "../Utils/interface";
import { useSelector, useDispatch } from "react-redux";
import { ChangeRootFolder, ExpandFolder, CollapseFolder, EnterFolderFromSidebar } from "../redux/storingData";
import { FaFolder, FaCaretDown, FaCaretRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { getErrorMessage } from "../Utils/common";

const SidebarFolder: FC<FileFolderPropType> = ({ itemId, item }: FileFolderPropType) => {
    const dispatch = useDispatch();
    const currentFolder: string | undefined = useSelector(
        (state: MainDataType) => state["currentPath"].find((item: ActiveFolderType) => item.isActive)?.id
    );
    // TODO try to use memo or callback whereever state remains the same
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    // TODO transfer this function to common functions
    const childrenIDs: string[] = Object.keys(explorerItems).filter((key) => explorerItems[key].parentId === itemId);
    const folders: string[] = childrenIDs
        .filter((id) => explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const files: string[] = childrenIDs
        .filter((id) => !explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const sortedChildren: string[] = [...folders, ...files];
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <>
            {/* TODO call expand/collapse function */}
            <div
                className={`flex ${
                    currentFolder === itemId && !inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-5 mx-10 my-5 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onDoubleClickCapture={(e: MouseEvent) => {
                    e.stopPropagation();
                    try {
                        if (itemId === "0") {
                            dispatch(ChangeRootFolder({ openRecycleBin: false }));
                        } else {
                            item.isFolder
                                ? dispatch(EnterFolderFromSidebar({ id: itemId }))
                                : toast.error("Double click on file is not supported");
                        }
                    } catch (error) {
                        toast.error(getErrorMessage(error));
                    }
                    return;
                }}
            >
                <FaFolder className="mr-2 -mt-1" /> <span className="flex-grow">{item.name}</span>
                <button
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        try {
                            if (item.isExpanded) {
                                dispatch(CollapseFolder({ id: itemId }));
                            } else {
                                dispatch(ExpandFolder({ id: itemId }));
                            }
                        } catch (error) {
                            toast.error(getErrorMessage(error));
                        }
                        return;
                    }}
                >
                    {item.isExpanded ? (
                        <FaCaretDown className="-mt-1.5 h-[30px] text-xl" />
                    ) : (
                        <FaCaretRight className="-mt-1.5 h-[30px] text-xl" />
                    )}
                </button>
            </div>
            {item.isExpanded &&
                sortedChildren.length > 0 &&
                sortedChildren.map((itemId: string, index: number) => {
                    return explorerItems[itemId].isFolder ? (
                        <SidebarFolder key={index} itemId={itemId} item={explorerItems[itemId]} />
                    ) : (
                        <SidebarFile key={index} itemId={itemId} item={explorerItems[itemId]} />
                    );
                })}
        </>
    );
};

export default SidebarFolder;
