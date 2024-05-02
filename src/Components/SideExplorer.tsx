import { FC, MouseEvent } from "react";
import Folder from "./Folder";
import { useSelector, useDispatch } from "react-redux";
import { ExplorerItemsType, MainDataType } from "../Utils/interface";
import { ChangeRootFolder } from "../redux/storingData";

const SideExplorer: FC = () => {
    const dispatch = useDispatch();
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const recycleBinItemCount: number = useSelector(
        (state: MainDataType) => Object.values(state["recycleBinItems"]).length - 1
    );
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <nav className="border-r-8">
            <Folder itemId={"0"} item={explorerItems[0]} />
            <div
                className="cursor-pointer"
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (!inRecycleBin) {
                        dispatch(ChangeRootFolder());
                    }
                    return;
                }}
            >
                🗑️ Recycle Bin {recycleBinItemCount}
            </div>
        </nav>
    );
};

export default SideExplorer;
