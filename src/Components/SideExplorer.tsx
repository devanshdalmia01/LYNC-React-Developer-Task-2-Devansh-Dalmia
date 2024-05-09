import { FC, MouseEvent, useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useModal, useRecycleBin, useSelectedItem } from "../Hooks/hooks";
import { useNavigate } from "react-router-dom";

const SideExplorer: FC = () => {
    const navigate = useNavigate();
    const { GetRecycleBinCount, inRecycleBin } = useRecycleBin();
    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>();
    const { acceptPressed } = useModal();
    const { id } = useSelectedItem();
    useEffect(() => {
        GetRecycleBinCount().then((value) => setRecycleBinItemCount(value));
    }, [acceptPressed, id]);
    return (
        <nav className="bg-secondary flex flex-col w-[390px] h-[78vh] overflow-y-scroll pb-20 pr-1.5 text-white">
            <div className="flex-grow mt-5 w-full overflow-x-scroll">
                <SidebarItem id="0" />
            </div>
            <div
                className={`flex ${
                    inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-4 mx-2 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/recyclebin");
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
