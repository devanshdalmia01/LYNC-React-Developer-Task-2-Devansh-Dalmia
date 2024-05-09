import { FC, useState, MouseEvent, useEffect } from "react";
import { VIEW } from "../Types/enums";
import { FaFolder, FaFile } from "react-icons/fa";
import {
    useSelectedItem,
    useCurrentLocation,
    useModal,
    useFileFolders,
    useRecycleBin,
    useViewTypeFilterSort,
} from "../Hooks/hooks";
import { FileFolderType } from "../Types/interface";
import { toast } from "react-toastify";
import { DoubleClickDiv, memoizedComputePath, memoizedGetDate, memoizedGetFileSize } from "../Utils/helper";
import { useNavigate } from "react-router-dom";
import GridButton from "./ViewButton";
import OptionButton from "./OptionButton";

const MainItems: FC = () => {
    const navigate = useNavigate();

    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>();
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);

    const { view, order, sort, typeFilter } = useViewTypeFilterSort();
    const { acceptPressed } = useModal();
    const { inRecycleBin, GetRecycleBinCount } = useRecycleBin();
    const { id, setId, setName, setIsFolder } = useSelectedItem();
    const { activePosition, currentPath } = useCurrentLocation();
    const { GetMainData } = useFileFolders();

    useEffect(() => {
        GetMainData({ parentId: currentPath[activePosition], order: order, sort: sort, type: typeFilter }).then(
            (result) => {
                setChildrenData(result);
            }
        );
        if (!childrenData.length) {
            setId("");
            setName("");
            setIsFolder(0);
        }
    }, [acceptPressed, inRecycleBin, activePosition, currentPath, recycleBinItemCount]);
    useEffect(() => {
        GetRecycleBinCount().then((value) => setRecycleBinItemCount(value));
    }, [acceptPressed, id]);

    const onDoubleClick = (item: { id: string; name: string; isFolder: number }, e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (inRecycleBin) {
            toast.error("Restore to navigate!");
        } else if (item.isFolder) {
            const checkInPath: number = currentPath.findIndex((value) => value === item.id);
            if (checkInPath !== -1) {
                navigate(memoizedComputePath(checkInPath, currentPath));
            } else {
                let temp = currentPath.slice(0, activePosition + 1);
                let tempLength = temp.push(item.id);
                navigate(memoizedComputePath(tempLength - 1, temp));
            }
        } else {
            toast.error("Opening a file is not supported, yet!");
        }
    };
    const onSingleClick = (item: { id: string; name: string; isFolder: number }, e: MouseEvent, from?: string) => {
        e.stopPropagation();
        if (item.id === id && !from) {
            setId("");
            setName("");
            setIsFolder(0);
        } else {
            setId(item.id);
            setName(item.name);
            setIsFolder(item.isFolder);
        }
    };

    return !(childrenData.length > 0) ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
            <h1 className="text-3xl font-bold text-primary">No file or folders added!</h1>
        </div>
    ) : (
        <>
            <div className="flex justify-around sticky top-0 mb-5 bg-gray-50">
                <div className="flex w-[96px] justify-between border-[1px] gray-400 rounded-full">
                    <GridButton type={VIEW.GRID} />
                    <GridButton type={VIEW.LIST} />
                </div>
            </div>
            {view === VIEW.LIST ? (
                <>
                    <div className="ml-12 mb-3 flex">
                        <div className="w-[6%] text-center text-xl font-semibold border-r-[1px]">Type</div>
                        <div className="w-[40%] text-center text-xl font-semibold border-r-[1px]">Name</div>
                        <div className="w-[20%] text-center text-xl font-semibold border-r-[1px]">Size/Items Count</div>
                        <div className="w-[24%] text-center text-xl font-semibold border-r-[1px]">Last Modified</div>
                        <div className="w-[8%] invisible" />
                    </div>
                    {childrenData.map((item: FileFolderType) => {
                        return (
                            <DoubleClickDiv
                                singleClick={onSingleClick}
                                doubleClick={onDoubleClick}
                                item={item}
                                className={`cursor-pointer ml-12 flex py-2 border-t-[1px] ${
                                    id === item.id ? "border-[1px] bg-white rounded-md border-primary" : ""
                                }`}
                                key={item.id}
                            >
                                <div className="w-[6%] text-center text-primary text-2xl font-semibold border-r-[1px]">
                                    {item.isFolder ? <FaFolder className="ml-5" /> : <FaFile className="ml-5" />}
                                </div>
                                <div className="w-[40%] flex items-center font-extrabold pl-5 border-r-[1px]">
                                    {item.name}
                                </div>
                                <div className="w-[20%] flex items-center justify-center font-normal text-xs text-gray-500 text-center border-r-[1px]">
                                    {item.isFolder ? (
                                        <span>{item.childrenCount} items</span>
                                    ) : (
                                        <span>{memoizedGetFileSize(item.size)}</span>
                                    )}
                                </div>
                                <div className="w-[24%] flex items-center justify-center font-normal text-xs text-gray-500 text-center border-r-[1px]">
                                    {memoizedGetDate(item.lastModifiedTime)}
                                </div>
                                <div className="w-[8%] flex items-center justify-center">
                                    <OptionButton onSingleClick={onSingleClick} item={item} />
                                </div>
                            </DoubleClickDiv>
                        );
                    })}
                </>
            ) : (
                <div className="ml-10 grid grid-cols-5 space-y-reverse space-y-5 pb-5">
                    {childrenData.map((item: FileFolderType) => {
                        return (
                            <div className="flex" key={item.id}>
                                <div className="relative right-8 top-4 z-50 h-0 order-2">
                                    <OptionButton onSingleClick={onSingleClick} item={item} />
                                </div>
                                <DoubleClickDiv
                                    singleClick={onSingleClick}
                                    doubleClick={onDoubleClick}
                                    item={item}
                                    className={`cursor-pointer order-1 shadow-md hover:shadow-none flex flex-col justify-between p-4 bg-white w-40 h-40 rounded-xl ${
                                        id === item.id ? "border-[1px] border-primary" : ""
                                    }`}
                                >
                                    <span>
                                        {item.isFolder ? (
                                            <FaFolder className="font-extrabold text-primary text-4xl" />
                                        ) : (
                                            <>
                                                <FaFile className="font-extrabold text-primary text-4xl" />
                                                <span className="font-normal ml-1.5 pt-5 text-sm text-gray-600">
                                                    {memoizedGetFileSize(item.size)}
                                                </span>
                                            </>
                                        )}
                                    </span>
                                    <span className="font-extrabold flex flex-col">
                                        {item.name?.slice(0, 13)}
                                        <span className="font-light text-xs text-gray-400">
                                            {item.isFolder ? (
                                                <>{item.childrenCount} items</>
                                            ) : (
                                                <>{memoizedGetDate(item.lastModifiedTime)}</>
                                            )}
                                        </span>
                                    </span>
                                </DoubleClickDiv>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default MainItems;
