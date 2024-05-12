import { FC, useState, MouseEvent, useEffect } from "react";
import { BUTTONS, SORT_ORDER, SORT_TYPE, TYPE_FILTER, VIEW } from "../Types/enums";
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
import { Radio, RadioGroup } from "@headlessui/react";
import { IoMdRadioButtonOn, IoMdRadioButtonOff, IoIosArrowDown } from "react-icons/io";
import { db } from "../Utils/db";
import { Tooltip } from "react-tooltip";
import Button from "./Button";

const MainItems: FC = () => {
    const navigate = useNavigate();

    // State for children data
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);
    const [itemChildrenCount, setItemChildrenCount] = useState<number>(0);

    // Hooks
    const { view, order, sort, typeFilter, setOrder, setSort, setTypeFilter } = useViewTypeFilterSort();
    const { acceptPressed } = useModal();
    const { inRecycleBin, recycleBinItemCount } = useRecycleBin();
    const { id, setId, setName, setIsFolder } = useSelectedItem();
    const { activePosition, currentPath } = useCurrentLocation();
    const { GetMainData } = useFileFolders();

    // Fetch children data based on filters
    useEffect(() => {
        db.filesAndFolders
            .get(currentPath[activePosition])
            .then((value) => setItemChildrenCount(value?.childrenCount as number));
        GetMainData({ parentId: currentPath[activePosition], order: order, sort: sort, type: typeFilter }).then(
            (result) => {
                setChildrenData(result);
            }
        );
        // Reset selected item if no children data
        if (!childrenData.length) {
            setId("");
            setName("");
            setIsFolder(0);
        }
    }, [acceptPressed, currentPath, order, sort, typeFilter]);

    // Handle double click event
    const onDoubleClick = (item: { id: string; name: string; isFolder: number }, e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (inRecycleBin) {
            toast.error("Restore to navigate!", {
                toastId: "error",
            });
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
            toast.error("Opening a file is not supported, yet!", {
                toastId: "error",
            });
        }
    };

    // Handle single click event
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
    return (inRecycleBin && recycleBinItemCount > 0) || (!inRecycleBin && itemChildrenCount > 0) ? (
        // Render if data exists
        <>
            <div className="flex justify-evenly sticky top-0 z-10 py-5 h-[88px] bg-gray-50">
                {!(currentPath.length === 1 && currentPath[0] === "0") ? (
                    <div className="w-[12%] flex items-center">
                        <Button type={BUTTONS.BACK_BUTTON} />
                    </div>
                ) : (
                    <div className="w-[12%] invisible" />
                )}
                <div className="relative flex w-[15%] justify-center items-center">
                    <select
                        name="type filter"
                        defaultChecked={true}
                        value={typeFilter}
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setTypeFilter(e.target.value as TYPE_FILTER);
                        }}
                        className="block h-8 w-[65%] appearance-none font-semibold rounded-lg bg-white border-[1px] border-gray-400 py-1 px-3 text-primary"
                    >
                        <option>Type</option>
                        <option value={TYPE_FILTER.FILE_FOLDER}>Both</option>
                        <option value={TYPE_FILTER.FOLDER}>Folder</option>
                        <option value={TYPE_FILTER.FILE}>File</option>
                    </select>
                    <IoIosArrowDown
                        className="group pointer-events-none absolute top-4 right-[50px] size-4 fill-primary"
                        aria-hidden="true"
                    />
                </div>
                <div className="relative flex w-[25%] justify-center items-center">
                    <select
                        name="sort header"
                        defaultChecked={true}
                        value={sort}
                        onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSort(e.target.value as SORT_TYPE);
                        }}
                        className="block h-8 w-[65%] appearance-none font-semibold rounded-lg bg-white border-[1px] border-gray-400 py-1 px-3 text-primary"
                    >
                        <option>Sort According To</option>
                        <option value={SORT_TYPE.NAME}>Name</option>
                        <option value={SORT_TYPE.LAST_MODIFIED}>Last Modified</option>
                        <option value={SORT_TYPE.SIZE}>Size/Item Count</option>
                    </select>
                    <IoIosArrowDown
                        className="group pointer-events-none absolute top-4 right-[60px] size-4 fill-primary"
                        aria-hidden="true"
                    />
                </div>
                <RadioGroup
                    value={order}
                    onChange={setOrder}
                    aria-label="Sort Order"
                    className="flex w-[23%] justify-between items-center"
                >
                    <Radio
                        key={SORT_ORDER.ASCENDING}
                        value={SORT_ORDER.ASCENDING}
                        className="flex items-center cursor-pointer text-black"
                    >
                        {order === SORT_ORDER.ASCENDING ? (
                            <IoMdRadioButtonOn className="fill-primary size-6" />
                        ) : (
                            <IoMdRadioButtonOff className="fill-primary size-6" />
                        )}
                        <div className="ml-3 font-semibold pt-0.5">Ascending</div>
                    </Radio>
                    <Radio
                        key={SORT_ORDER.DESCENDING}
                        value={SORT_ORDER.DESCENDING}
                        className="flex items-center cursor-pointer text-black"
                    >
                        {order === SORT_ORDER.DESCENDING ? (
                            <IoMdRadioButtonOn className="fill-primary size-6" />
                        ) : (
                            <IoMdRadioButtonOff className="fill-primary size-6" />
                        )}
                        <div className="ml-3 font-semibold pt-0.5">Descending</div>
                    </Radio>
                </RadioGroup>
                <div className="flex justify-between border-[1px] gray-400 rounded-full">
                    <GridButton type={VIEW.GRID} />
                    <GridButton type={VIEW.LIST} />
                </div>
            </div>
            {childrenData.length === 0 ? (
                <div className="w-full h-[50vh] flex items-center justify-center">
                    <h1 className="text-3xl font-bold text-primary">Change filters to view data! 😛</h1>
                </div>
            ) : (
                <>
                    {/* Render based on view type */}
                    {view === VIEW.LIST ? (
                        // Render as list
                        <>
                            <div className="ml-12 mb-3 flex">
                                {/* Headers */}
                                <div className="w-[6%] text-center text-xl font-semibold border-r-[1px]">Type</div>
                                <div className="w-[40%] text-center text-xl font-semibold border-r-[1px]">Name</div>
                                <div className="w-[20%] text-center text-xl font-semibold border-r-[1px]">
                                    Size/Items Count
                                </div>
                                <div className="w-[24%] text-center text-xl font-semibold border-r-[1px]">
                                    Last Modified
                                </div>
                                <div className="w-[8%] invisible" />
                            </div>
                            {/* Render items */}
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
                                        {/* Item details */}
                                        <div className="w-[6%] text-center text-primary text-2xl font-semibold border-r-[1px]">
                                            {item.isFolder ? (
                                                <FaFolder className="ml-5" />
                                            ) : (
                                                <FaFile className="ml-5" />
                                            )}
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
                                            {/* Option button */}
                                            <OptionButton onSingleClick={onSingleClick} item={item} />
                                        </div>
                                    </DoubleClickDiv>
                                );
                            })}
                        </>
                    ) : (
                        // Render as grid
                        <div className="ml-6 grid grid-cols-5 gap-5 pb-5">
                            {/* Render items */}
                            {childrenData.map((item: FileFolderType) => {
                                return (
                                    <div className="flex items-center justify-center" key={item.id}>
                                        <div className="relative right-9 bottom-16 h-0 order-2">
                                            {/* Option button */}
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
                                            <Tooltip id={item.id} />
                                            <span
                                                className="font-extrabold flex flex-col"
                                                data-tooltip-id={item.id}
                                                data-tooltip-content={item.name}
                                            >
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
            )}
        </>
    ) : (
        // Render if no data
        <>
            {!(currentPath.length === 1 && currentPath[0] === "0") && (
                <div className="flex justify-start sticky top-0 z-10 py-5 h-[88px] bg-gray-50">
                    <div className="w-[12%] flex items-center ml-[31.5px]">
                        <Button type={BUTTONS.BACK_BUTTON} />
                    </div>
                </div>
            )}
            <div className="w-full h-[50vh] flex items-center justify-center">
                <h1 className="text-3xl font-bold text-primary">No file or folders added!</h1>
            </div>
        </>
    );
};

export default MainItems;
