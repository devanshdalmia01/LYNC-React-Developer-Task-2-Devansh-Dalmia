import { FC, MouseEvent } from "react";
import { FileFolderPropType } from "../Utils/interface";
import File from "./File";
import { ExplorerItemsType, MainDataType } from "../Utils/interface";
import { useSelector, useDispatch } from "react-redux";
import { ChangeRootFolder } from "../redux/storingData";

const Folder: FC<FileFolderPropType> = ({ itemId, item }: FileFolderPropType) => {
    const dispatch = useDispatch();
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
                className="folder cursor-pointer"
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (inRecycleBin && itemId === "0") {
                        dispatch(ChangeRootFolder());
                    }
                    return;
                }}
            >
                {item.isExpanded ? "-" : "+"} 🗂️ {item.name}
            </div>
            {item.isExpanded &&
                sortedChildren.length > 0 &&
                sortedChildren.map((itemId: string, index: number) => {
                    return explorerItems[itemId].isFolder ? (
                        <Folder key={index} itemId={itemId} item={explorerItems[itemId]} />
                    ) : (
                        <File key={index} itemId={itemId} item={explorerItems[itemId]} />
                    );
                })}
        </>
    );
};

export default Folder;
