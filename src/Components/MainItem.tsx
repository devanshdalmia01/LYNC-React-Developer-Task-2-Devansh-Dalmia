import { FC, MouseEvent, useContext } from "react";
import { MainAreaFileFolderPropType, SelectedItemContextType } from "../Utils/interface";
import { FaFolder, FaFile } from "react-icons/fa";
import { VIEW } from "../Utils/enums";
import { SelectedItem } from "../Utils/context";

const MainItem: FC<MainAreaFileFolderPropType> = ({ itemId, item, view }: MainAreaFileFolderPropType) => {
    const { selectedItem, setSelectedItem } = useContext<SelectedItemContextType>(SelectedItem);
    return (
        <div
            className={`cursor-pointer ${
                view === VIEW.GRID
                    ? `shadow-md hover:shadow-none flex flex-col justify-between p-4 bg-quinary w-36 h-40 rounded-xl ${
                          selectedItem === itemId ? "border-[1px] border-primary" : ""
                      }`
                    : `flex items-center mt-1 py-2 border-t-[1px] w-[96%] ${
                          selectedItem === itemId ? "border-[1px] border-primary" : ""
                      }`
            }`}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                setSelectedItem(itemId);
                return;
            }}
        >
            <span>
                {item.isFolder ? (
                    <FaFolder
                        className={`font-extrabold text-primary ${view === VIEW.GRID ? "text-3xl" : "text-2xl mr-5"}`}
                    />
                ) : (
                    <FaFile
                        className={`font-extrabold text-primary ${view === VIEW.GRID ? "text-3xl" : "text-2xl mr-5"}`}
                    />
                )}
            </span>
            <span className={`font-extrabold ${view === VIEW.GRID ? "" : "mt-1"}`}>
                {view === VIEW.GRID ? item.name.slice(0, 13) : item.name}
            </span>
        </div>
    );
};

export default MainItem;
