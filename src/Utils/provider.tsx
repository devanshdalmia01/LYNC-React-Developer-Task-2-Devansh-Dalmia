import { useState, FC } from "react";
import { ProviderType, FileFolderType } from "./interface";
import { SelectedItem, Modal, FileFolders, RecycleBin, ViewTypeFilterSort, CurrentLocation } from "./context";
import { db } from "./db";
import { SORT_TYPE, SORT_ORDER, TYPE_FILTER, VIEW, MODALS } from "./enums";
import { fetchData, getErrorMessage } from "./common";
import { toast } from "react-toastify";

export const SelectedItemProvider: FC<ProviderType> = ({ children }) => {
    const [id, setId] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [isFolder, setIsFolder] = useState<number>(0);
    return (
        <SelectedItem.Provider
            value={{
                id,
                setId,
                name,
                setName,
                isFolder,
                setIsFolder,
            }}
        >
            {children}
        </SelectedItem.Provider>
    );
};

export const ModalProvider: FC<ProviderType> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<MODALS>(MODALS.NULL);
    const [data, setData] = useState<string | File>("");
    const [acceptPressed, setAcceptPressed] = useState<boolean>(false);
    const openModal = (modalType: MODALS, data?: string) => {
        setType(modalType);
        setData(data || "");
        setIsOpen(true);
    };
    const closeModal = () => {
        setIsOpen(false);
        setType(MODALS.NULL);
        setData("");
        setAcceptPressed(false);
    };
    return (
        <Modal.Provider
            value={{
                isOpen,
                type,
                data,
                setType,
                setData,
                openModal,
                closeModal,
                acceptPressed,
                setAcceptPressed,
            }}
        >
            {children}
        </Modal.Provider>
    );
};

export const ViewTypeFilterSortProvider: FC<ProviderType> = ({ children }) => {
    const [view, setView] = useState<VIEW>(VIEW.GRID);
    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>(TYPE_FILTER.FILE_FOLDER);
    const [sort, setSort] = useState<SORT_TYPE>(SORT_TYPE.NAME);
    const [order, setOrder] = useState<SORT_ORDER>(SORT_ORDER.ASCENDING);
    return (
        <ViewTypeFilterSort.Provider
            value={{
                view,
                typeFilter,
                sort,
                order,
                setView,
                setTypeFilter,
                setSort,
                setOrder,
            }}
        >
            {children}
        </ViewTypeFilterSort.Provider>
    );
};

export const CurrentLocationProvider: FC<ProviderType> = ({ children }) => {
    const [activePosition, setActivePosition] = useState<number>(0);
    const [currentPath, setCurrentPath] = useState<string[]>(["0"]);
    return (
        <CurrentLocation.Provider
            value={{
                activePosition,
                currentPath,
                setActivePosition,
                setCurrentPath,
            }}
        >
            {children}
        </CurrentLocation.Provider>
    );
};

export const FileFoldersProvider: FC<ProviderType> = ({ children }) => {
    const GetMainData = async (data: {
        parentId: string;
        sort: SORT_TYPE;
        type: TYPE_FILTER;
        order: SORT_ORDER;
    }): Promise<FileFolderType[]> => {
        try {
            switch (data.type) {
                case TYPE_FILTER.FILE:
                    return await fetchData({ ...data, isFolder: 0 });
                case TYPE_FILTER.FOLDER:
                    return await fetchData({ ...data, isFolder: 1 });
                case TYPE_FILTER.FILE_FOLDER:
                    const folders = await fetchData({ ...data, isFolder: 1 });
                    const files = await fetchData({ ...data, isFolder: 0 });
                    return [...folders, ...files];
                default:
                    throw new Error("Invalid type filter");
            }
        } catch (error) {
            throw new Error(getErrorMessage(error));
        }
    };
    const AddNewFileFolder = async (data: FileFolderType) => {
        const existingItem = await db.filesAndFolders.get({
            name: data.name,
            parentId: data.parentId,
            isFolder: data.isFolder,
        });

        if (existingItem) {
            throw new Error(`${data.isFolder ? "Folder" : "File"} with this name already exists!`);
        }

        const parentFolder = await db.filesAndFolders.get(data.parentId);

        if (!parentFolder) {
            throw new Error(`Parent folder doesn't exist!`);
        }

        try {
            await db.filesAndFolders.add(data, data.id);

            const updatedChildrenCount = (parentFolder.childrenCount ?? 0) + 1;
            await db.filesAndFolders.update(data.parentId, {
                childrenCount: updatedChildrenCount,
                lastModifiedTime: new Date(),
            });
        } catch (error) {
            throw new Error("Failed to add or update file/folder due to an internal error.");
        }
    };
    const RenameFileFolder = async (data: { id: string; name: string }) => {
        const dbData = await db.filesAndFolders.get(data.id);

        if (!dbData) {
            throw new Error("Folder/File doesn't exist!");
        }

        const existingItem = await db.filesAndFolders.get({
            name: data.name,
            parentId: dbData.parentId,
            isFolder: dbData.isFolder,
        });

        if (existingItem) {
            throw new Error(`${dbData.isFolder ? "Folder" : "File"} with this name already exists!`);
        }

        await db.filesAndFolders.update(data.id, { name: data.name, lastModifiedTime: new Date() });
    };
    const DeleteFileFolder = async (data: { id: string }) => {
        const itemToDelete = await db.filesAndFolders.get(data.id);

        if (!itemToDelete) {
            throw new Error("Folder/File doesn't exist!");
        }

        try {
            await db.recycleBin.add(
                {
                    ...itemToDelete,
                    parentId: "-1",
                    lastModifiedTime: new Date(),
                },
                itemToDelete.id
            );

            await db.filesAndFolders.delete(data.id);

            if (itemToDelete.parentId !== "-1") {
                const parentFolder = await db.filesAndFolders.get(itemToDelete.parentId);
                if (parentFolder) {
                    const updatedChildrenCount = (parentFolder.childrenCount ?? 1) - 1;
                    await db.filesAndFolders.update(itemToDelete.parentId, {
                        childrenCount: updatedChildrenCount,
                        lastModifiedTime: new Date(),
                    });
                }
            }
        } catch (error) {
            throw new Error("Failed to delete the item due to an internal error.");
        }
    };
    return (
        <FileFolders.Provider
            value={{
                GetMainData,
                AddNewFileFolder,
                RenameFileFolder,
                DeleteFileFolder,
            }}
        >
            {children}
        </FileFolders.Provider>
    );
};

export const RecycleBinProvider: FC<ProviderType> = ({ children }) => {
    const [inRecycleBin, setInRecycleBin] = useState<boolean>(false);
    const PermanentlyDeleteFileFolder = async (data: { id: string }) => {
        try {
            await db.transaction("rw", [db.recycleBin, db.filesAndFolders], async () => {
                const item = await db.recycleBin.get(data.id);
                if (!item) {
                    throw new Error("Folder/File doesn't exist!");
                }

                await db.recycleBin.delete(data.id);

                const childrenIds = await db.filesAndFolders.where({ parentId: data.id }).primaryKeys();
                if (childrenIds.length > 0) {
                    await db.filesAndFolders.bulkDelete(childrenIds);
                }
            });
        } catch (error) {
            throw new Error("Failed to perform delete operations due to an internal error.");
        }
    };
    const RestoreFileFolder = async (data: { id: string }) => {
        try {
            const itemToRestore = await db.recycleBin.get(data.id);
            if (!itemToRestore) {
                throw new Error("Folder/File doesn't exist in the recycle bin!");
            }

            if (!itemToRestore.parentLineage || itemToRestore.parentLineage.length === 0) {
                throw new Error("No valid parent information available to restore the item.");
            }

            const lastKnownParentId = itemToRestore.parentLineage[itemToRestore.parentLineage.length - 1];

            const parentExists = await db.filesAndFolders.get(lastKnownParentId);

            if (!parentExists) {
                toast.warning('Parent directory does not exist. Restoring to "Home".');
                itemToRestore.parentId = "0";
                itemToRestore.parentLineage = ["0"];
                itemToRestore.lastModifiedTime = new Date();
            } else {
                itemToRestore.parentId = lastKnownParentId;
                itemToRestore.lastModifiedTime = new Date();
            }

            await db.transaction("rw", [db.filesAndFolders, db.recycleBin], async () => {
                await db.filesAndFolders.add({
                    ...itemToRestore,
                });
                await db.recycleBin.delete(data.id);
            });
        } catch (error) {
            throw new Error("Failed to restore due to an internal error.");
        }
    };
    const EmptyRecycleBin = async () => {
        try {
            await db.transaction("rw", [db.recycleBin, db.filesAndFolders], async () => {
                const keys = await db.recycleBin.where({ parentId: "-1" }).primaryKeys();

                await db.recycleBin.bulkDelete(keys);

                for (const key of keys) {
                    await db.filesAndFolders.where({ parentId: key }).delete();
                }

                if (!(await db.filesAndFolders.where({ parentId: "0" }).count())) {
                    await db.filesAndFolders.clear();
                    await db.filesAndFolders.add({
                        id: "0",
                        name: "Home",
                        isFolder: 1,
                        isExpanded: true,
                        parentLineage: [],
                        parentId: "-2",
                        childrenCount: 0,
                        lastModifiedTime: new Date(),
                        size: 0,
                    });
                }
            });
        } catch (error) {
            throw new Error("Failed to perform operations due to an internal error.");
        }
    };
    const GetRecycleBinCount = async () => {
        try {
            return await db.recycleBin.where({ parentId: "-1" }).count();
        } catch (error) {
            throw new Error("Failed to retrieve recycle bin count due to an internal error.");
        }
    };
    return (
        <RecycleBin.Provider
            value={{
                inRecycleBin,
                setInRecycleBin,
                GetRecycleBinCount,
                PermanentlyDeleteFileFolder,
                RestoreFileFolder,
                EmptyRecycleBin,
            }}
        >
            {children}
        </RecycleBin.Provider>
    );
};
