import { FC, MouseEvent } from "react";
import SidebarItem from "./SidebarItem";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useRecycleBin } from "../Hooks/hooks";
import { useNavigate } from "react-router-dom";

const SideExplorer: FC = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate between routes.
    const { inRecycleBin, recycleBinItemCount } = useRecycleBin(); // Access to recycle bin-related state.
    return (
        <nav className="bg-secondary flex flex-col w-[390px] h-[78vh] overflow-y-scroll pb-20 pr-1.5 text-white">
            <div className="flex-grow mt-5 w-full overflow-x-scroll">
                {/* Render the main sidebar item, to view the heirarchy of all the data */}
                <SidebarItem currentId="0" isFolder={1} />
            </div>
            <div
                className={`flex ${
                    inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-4 mx-2 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate("/recyclebin"); // Navigate to the recycle bin view.
                }}
            >
                <RiDeleteBin6Fill className="mr-2 -mt-1" />
                <span className="flex-grow">Recycle Bin</span>
                {/* Displays the count of items in the recycle bin. */}
                {recycleBinItemCount}
            </div>
        </nav>
    );
};

export default SideExplorer;
