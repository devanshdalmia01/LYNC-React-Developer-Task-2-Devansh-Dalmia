import { FC } from "react";
import { useSelector } from "react-redux";
import { MainDataType, ExplorerItemsType, ActiveFolderType, ViewPropType } from "../Utils/interface";
import MainItem from "./MainItem";

const MainItemExplorer: FC<ViewPropType> = ({ view }: ViewPropType) => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentPath: ActiveFolderType[] = useSelector((state: MainDataType) => state["currentPath"]);
    const activePos: number = currentPath.findIndex((item: ActiveFolderType) => item.isActive);
    const childrenIds: string[] = Object.keys(explorerItems).filter(
        (key) => explorerItems[key].parentId === currentPath[activePos].id
    );
    const folders: string[] = childrenIds
        .filter((id) => explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const files: string[] = childrenIds
        .filter((id) => !explorerItems[id].isFolder)
        .sort((a, b) => explorerItems[a].name.localeCompare(explorerItems[b].name));
    const sortedChildren: string[] = [...folders, ...files];
    return !(sortedChildren.length > 0) ? (
        <h1 className="text-3xl font-bold text-primary">No file or folders added!</h1>
    ) : (
        sortedChildren.map((itemId: string, index: number) => {
            return <MainItem key={index} itemId={itemId} item={explorerItems[itemId]} view={view} />;
        })
    );
};

export default MainItemExplorer;
