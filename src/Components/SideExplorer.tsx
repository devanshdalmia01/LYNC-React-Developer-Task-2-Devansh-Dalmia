import { FC } from "react";
import Folder from "./Folder";
import { useSelector } from "react-redux";
import { ExplorerItemsType, MainDataType } from "../Utils/interface";

const SideExplorer: FC = () => {
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const recycleBinItemCount: number = useSelector(
        (state: MainDataType) => Object.values(state["recycleBinItems"]).length - 1
    );
    return (
        <nav className="border-r-8">
            <Folder itemId={"0"} item={explorerItems[0]} />
            <div>🗑️ Recycle Bin {recycleBinItemCount}</div>
        </nav>
    );
};

export default SideExplorer;
