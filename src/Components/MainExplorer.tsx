import Button from "./Button";
import { useSelector } from "react-redux";
import { MainDataType, ExplorerItemsType } from "../Utils/interface";
import File from "./File";
import Folder from "./Folder";
import { BUTTONS } from "../Utils/enums";

const MainExplorer = () => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentLocation: string = useSelector(
        (state: MainDataType) => state["currentLocation"][state["currentLocation"].length - 1]
    );
    // Separate children into folders and files
    const childrenIDs: string[] = Object.keys(explorerItems).filter(
        (key) => explorerItems[key].parentId === currentLocation
    );
    const folders: string[] = childrenIDs
        .filter((id) => explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const files: string[] = childrenIDs
        .filter((id) => !explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));

    // Combine folders first and then files for display
    const sortedChildren: string[] = [...folders, ...files];
    return (
        <main className="mainarea">
            {sortedChildren.length > 0 &&
                sortedChildren.map((itemId: string, index: number) => {
                    return explorerItems[itemId].isFolder ? (
                        <Folder key={index} itemId={itemId} item={explorerItems[itemId]} />
                    ) : (
                        <File key={index} itemId={itemId} item={explorerItems[itemId]} />
                    );
                })}
            <div className="filesandfolder"></div>
            <Button type={BUTTONS.ADD_FILE} />
            <Button type={BUTTONS.ADD_FOLDER} />
        </main>
    );
};

export default MainExplorer;
