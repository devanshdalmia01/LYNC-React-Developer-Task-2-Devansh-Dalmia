import Button from "./Button";
import { FC } from "react";
import { useSelector } from "react-redux";
import { MainDataType, ActiveFolderType, ViewPropType, RecycleBinItemsType, FileFolderType } from "../Utils/interface";
import MainItem from "./MainItem";
import { BUTTONS, NAV_BUTTONS, VIEW } from "../Utils/enums";
import NavButton from "./NavButton";
import MainItemExplorer from "./MainItemExplorer";

const MainExplorer: FC<ViewPropType> = ({ view }: ViewPropType) => {
    const recycleBinItems: RecycleBinItemsType = useSelector((state: MainDataType) => state["recycleBinItems"]);
    const currentPath: ActiveFolderType[] = useSelector((state: MainDataType) => state["currentPath"]);
    const inRecycleBin: boolean = useSelector((state: MainDataType) => state["inRecycleBin"]);
    const activePos: number = currentPath.findIndex((item: ActiveFolderType) => item.isActive);
    return (
        <main className="bg-quaternary w-[74vw] h-[82.5vh] pt-8 overflow-y-scroll">
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
            <div
                className={`mt-8 ml-10 ${
                    view === VIEW.GRID ? "grid grid-cols-5 space-y-reverse space-y-5 pb-5" : "flex flex-col pb-5"
                }`}
            >
                {!inRecycleBin ? (
                    <MainItemExplorer view={view} />
                ) : (
                    Object.entries(recycleBinItems).map((value: [string, FileFolderType], index: number) => {
                        return <MainItem key={index} itemId={value[0]} item={value[1]} view={view} />;
                    })
                )}
            </div>
        </main>
    );
};

export default MainExplorer;
