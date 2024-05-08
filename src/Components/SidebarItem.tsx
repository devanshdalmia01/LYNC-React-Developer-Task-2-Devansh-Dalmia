import { FC, MouseEvent, useState, useEffect } from "react";
import { FaFolder, FaCaretDown, FaCaretRight, FaFile } from "react-icons/fa";
import { toast } from "react-toastify";
import { computePath, getErrorMessage } from "../Utils/common";
import { useCurrentLocation, useRecycleBin, useFileFolders, useModal } from "../Utils/customHooks";
import { FileFolderType } from "../Utils/interface";
import { db } from "../Utils/db";
import { useNavigate } from "react-router-dom";
import { SORT_ORDER, SORT_TYPE, TYPE_FILTER } from "../Utils/enums";

const SidebarItem: FC<{ id: string }> = ({ id }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>();
    const [childrenData, setChildrenData] = useState<FileFolderType[]>([]);
    const { activePosition, currentPath } = useCurrentLocation();
    const { inRecycleBin, GetRecycleBinCount } = useRecycleBin();
    const { GetMainData } = useFileFolders();
    const { acceptPressed } = useModal();
    const [itemData, setItemData] = useState<FileFolderType | undefined>({
        id: "",
        name: "",
        isExpanded: false,
        isFolder: 0,
        parentLineage: [],
        parentId: "",
        lastModifiedTime: new Date(),
        childrenCount: 0,
        size: 0,
    });
    useEffect(() => {
        db.filesAndFolders.get(id).then((value) => setItemData(value));
        GetMainData({
            parentId: id,
            order: SORT_ORDER.ASCENDING,
            type: TYPE_FILTER.FILE_FOLDER,
            sort: SORT_TYPE.NAME,
        }).then((result) => {
            setChildrenData(result);
        });
    }, [acceptPressed, inRecycleBin, activePosition, currentPath, recycleBinItemCount, isExpanded]);
    useEffect(() => {
        GetRecycleBinCount().then((value) => setRecycleBinItemCount(value));
    }, [acceptPressed, id]);
    return (
        <>
            <div
                className={`flex ${
                    currentPath[activePosition] === id && !inRecycleBin ? "bg-primary text-white" : "text-gray-400"
                } px-4 mx-2 pt-3 pb-2.5 rounded-xl cursor-pointer items-center`}
                onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    if (itemData?.isFolder) {
                        try {
                            let temp: string[] = [...itemData.parentLineage];
                            temp.push(itemData.id);
                            navigate(computePath(temp.length - 1, temp));
                        } catch (error) {
                            toast.error(getErrorMessage(error));
                        }
                    } else {
                        toast.error("Opening a file is not supported, yet!");
                    }
                    return;
                }}
            >
                {itemData?.isFolder ? <FaFolder className="mr-2 -mt-1" /> : <FaFile className="mr-2 -mt-1" />}
                <span className="flex-grow">{itemData?.name}</span>
                <button
                    className="cursor-pointer"
                    onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (itemData?.isExpanded) {
                            db.filesAndFolders
                                .update(itemData.id, { isExpanded: false })
                                .then(() => setIsExpanded(!isExpanded))
                                .catch((error) => toast.error(getErrorMessage(error)));
                        } else {
                            db.filesAndFolders
                                .update(itemData?.id, { isExpanded: true })
                                .then(() => setIsExpanded(!isExpanded))
                                .catch((error) => toast.error(getErrorMessage(error)));
                        }
                        return;
                    }}
                >
                    {itemData?.isFolder ? (
                        itemData?.isExpanded ? (
                            <FaCaretDown className="-mt-1.5 h-[30px] text-xl" />
                        ) : (
                            <FaCaretRight className="-mt-1.5 h-[30px] text-xl" />
                        )
                    ) : (
                        ""
                    )}
                </button>
            </div>
            <div className="pl-3">
                {itemData?.isExpanded &&
                    childrenData.length > 0 &&
                    childrenData.map((item: FileFolderType) => {
                        return <SidebarItem key={item.id} id={item.id} />;
                    })}
            </div>
        </>
    );
};

export default SidebarItem;
