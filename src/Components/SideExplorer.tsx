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
        (state: MainDataType) => Object.values(state["recycleBinItems"]).length
    );
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    return (
        <nav className="bg-secondary flex flex-col w-[390px] h-[78vh] overflow-y-scroll pb-20 pr-1.5 text-white">
            <div className="flex-grow w-full overflow-x-scroll">
                <SidebarFolder itemId={"0"} item={explorerItems[0]} />
            </div>
            <div
                className={`flex ${
                    inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-5 mx-10 my-5 pt-3 pb-2.5 cursor-pointer rounded-xl items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    dispatch(ChangeRootFolder({ openRecycleBin: true }));
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
