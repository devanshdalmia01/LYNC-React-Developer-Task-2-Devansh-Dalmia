import Button from "./Button";
import { FC } from "react";
import { useSelector } from "react-redux";
import { MainDataType, ExplorerItemsType, ActiveFolderType, ViewPropType } from "../Utils/interface";
import MainFile from "./MainFile";
import MainFolder from "./MainFolder";
import { BUTTONS, NAV_BUTTONS } from "../Utils/enums";
import NavButton from "./NavButton";

const MainExplorer: FC<ViewPropType> = ({ view }: ViewPropType) => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentPath: ActiveFolderType[] = useSelector((state: MainDataType) => state["currentPath"]);
    const activePos: number = currentPath.findIndex((item: ActiveFolderType) => item.isActive);
    // Separate children into folders and files
    const childrenIDs: string[] = Object.keys(explorerItems).filter(
        (key) => explorerItems[key].parentId === currentPath[activePos].id
    );
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
        <main className="bg-quaternary w-[74vw] h-[82.5vh] pt-5">
            {!inRecycleBin && (
                <div className="flex">
                    <div className="flex-grow">
                        {activePos != 0 && <NavButton type={NAV_BUTTONS.BACK_BUTTON} />}
                        {activePos != currentPath.length - 1 && <NavButton type={NAV_BUTTONS.NEXT_BUTTON} />}
                    </div>
                    <div className="flex">
                        <Button type={BUTTONS.ADD_FILE} />
                        <Button type={BUTTONS.ADD_FOLDER} />
                    </div>
                </div>
            )}
            {sortedChildren.length > 0 &&
                sortedChildren.map((itemId: string, index: number) => {
                    return explorerItems[itemId].isFolder ? (
                        <MainFolder key={index} itemId={itemId} item={explorerItems[itemId]} view={view} />
                    ) : (
                        <MainFile key={index} itemId={itemId} item={explorerItems[itemId]} view={view}/>
                    );
                })}
        </main>
    );
};

export default MainExplorer;
