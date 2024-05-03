import { FC, MouseEvent } from "react";
import { FileFolderPropType } from "../Utils/interface";
import SidebarFile from "./SidebarFile";
import { ExplorerItemsType, MainDataType, ActiveFolderType } from "../Utils/interface";
import { useSelector, useDispatch } from "react-redux";
import { ChangeRootFolder, ExpandFolder, CollapseFolder } from "../redux/storingData";
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
    // Separate children into folders and files
    const childrenIDs: string[] = Object.keys(explorerItems).filter((key) => explorerItems[key].parentId === itemId);
    const folders: string[] = childrenIDs
        .filter((id) => explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const files: string[] = childrenIDs
        .filter((id) => !explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));

    // Combine folders first and then files for display
    const sortedChildren: string[] = [...folders, ...files];
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <>
            {/* TODO call expand/collapse function */}
            <div
                className={`flex ${
                    currentFolder === itemId || !inRecycleBin ? "bg-primary text-quinary" : "text-gray-400"
                } px-5 mx-10 my-5 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (inRecycleBin && itemId === "0") {
                        dispatch(ChangeRootFolder());
                    }
                    return;
                }}
            >
                <FaFolder className="mr-2 -mt-1" /> <span className="flex-grow">{item.name}</span>
                {item.isExpanded ? (
                    <FaCaretDown
                        className="-mt-1.5"
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            try {
                                dispatch(ExpandFolder({ id: itemId }));
                            } catch (error) {
                                toast.error(getErrorMessage(error));
                            }
                        }}
                    />
                ) : (
                    <FaCaretRight
                        className="-mt-1.5"
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            try {
                                dispatch(CollapseFolder({ id: itemId }));
                            } catch (error) {
                                toast.error(getErrorMessage(error));
                            }
                        }}
                    />
                )}
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
