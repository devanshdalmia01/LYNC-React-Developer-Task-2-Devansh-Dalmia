import { FC, MouseEvent } from "react";
import SidebarFolder from "./SidebarFolder";
import { useSelector, useDispatch } from "react-redux";
import { ExplorerItemsType, MainDataType } from "../Utils/interface";
import { ChangeRootFolder } from "../redux/storingData";
import { RiDeleteBin6Fill } from "react-icons/ri";

const SideExplorer: FC = () => {
    const dispatch = useDispatch();
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const recycleBinItemCount: number = useSelector(
        (state: MainDataType) => Object.values(state["recycleBinItems"]).length - 1
    );
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <nav className="bg-tertiary flex flex-col w-[390px] h-[78vh] pb-20 pr-1.5 text-quinary">
            <div className="flex-grow">
                <SidebarFolder itemId={"0"} item={explorerItems[0]} />
            </div>
            <div
                className={`flex ${
                    inRecycleBin ? "bg-primary text-quinary" : "text-gray-400"
                } px-5 mx-10 my-5 pt-3 pb-2.5 cursor-pointer rounded-xl items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (!inRecycleBin) {
                        dispatch(ChangeRootFolder());
                    }
                    return;
                }}
            >
                <RiDeleteBin6Fill className="mr-2 -mt-1" />
                <span className="flex-grow">Recycle Bin</span>
                {recycleBinItemCount}
            </div>
        </nav>
    );
};

export default SideExplorer;
