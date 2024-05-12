import { useState, FC, useEffect } from "react";
import { ProviderType, FileFolderType } from "../Types/interface";
import { SelectedItem, Modal, FileFolders, RecycleBin, ViewTypeFilterSort, CurrentLocation } from "./context";
import { db } from "../Utils/db";
import { SORT_TYPE, SORT_ORDER, TYPE_FILTER, VIEW, MODALS } from "../Types/enums";
import { fetchData, getErrorMessage } from "../Utils/helper";
import { toast } from "react-toastify";

// Provides context for the selected item within the application.
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

// Provides context for handling modal dialog states and interactions.
export const ModalProvider: FC<ProviderType> = ({ children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [type, setType] = useState<MODALS>(MODALS.NULL);
    const [data, setData] = useState<string | File>("");
    const [acceptPressed, setAcceptPressed] = useState<boolean>(false);
    const [openFileFinder, setOpenFileFinder] = useState<boolean>(true);

    // Function to handle opening modals with appropriate data and type.
    const openModal = (modalType: MODALS, data?: string | File) => {
        setType(modalType);
        setData(data || "");
        setIsOpen(true);
    };

    // Function to handle the closure of modals and reset associated state.
    const closeModal = () => {
        setIsOpen(false);
        setType(MODALS.NULL);
        setData("");
        setAcceptPressed(false);
        setOpenFileFinder(true);
    };

    return (
        <Modal.Provider
            value={{
                openFileFinder,
                isOpen,
                type,
                data,
                acceptPressed,
                setType,
                setData,
                openModal,
                closeModal,
                setAcceptPressed,
                setOpenFileFinder,
            }}
        >
            {children}
        </Modal.Provider>
    );
};

// Provides context for managing view settings like sorting and filtering.
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

// Provides context for tracking and managing the current location within the application.
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

// Provides context for interacting with the file system managed in an IndexedDB.
export const FileFoldersProvider: FC<ProviderType> = ({ children }) => {
    // Dynamically fetches data based on sorting, filtering, and parent directory.
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

    // Function to handle adding a new file or folder, checking for duplicates and existence of parent.
    const AddNewFileFolder = async (data: FileFolderType) => {
        // Check for an existing item with the same name in the same directory.
        const existingItem = await db.filesAndFolders.get({
            name: data.name,
            parentId: data.parentId,
            isFolder: data.isFolder,
        });

        if (existingItem) {
            throw new Error(`${data.isFolder ? "Folder" : "File"} with this name already exists!`);
        }

        // Ensure the parent directory exists before adding a new item.
        const parentFolder = await db.filesAndFolders.get(data.parentId);
        if (!parentFolder) {
            throw new Error(`Parent folder doesn't exist!`);
        }

        try {
            // Add the new item and update the parent's child count and last modified time.
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

    // Handles renaming of files and folders, checking for conflicts in names.
    const RenameFileFolder = async (data: { id: string; name: string }) => {
        const dbData = await db.filesAndFolders.get(data.id);

        if (!dbData) {
            throw new Error("Folder/File doesn't exist!");
        }

        // Check if there's already a file or folder with the new name in the same directory.
        const existingItem = await db.filesAndFolders.get({
            name: data.name,
            parentId: dbData.parentId,
            isFolder: dbData.isFolder,
        });

        if (existingItem) {
            throw new Error(`${dbData.isFolder ? "Folder" : "File"} with this name already exists!`);
        }

        // Update the name and last modified time of the item.
        await db.filesAndFolders.update(data.id, { name: data.name, lastModifiedTime: new Date() });
    };

    return (
        <FileFolders.Provider
            value={{
                GetMainData,
                AddNewFileFolder,
                RenameFileFolder,
            }}
        >
            {children}
        </FileFolders.Provider>
    );
};

// Provides context for managing the recycle bin, including restoration and deletion of items.
export const RecycleBinProvider: FC<ProviderType> = ({ children }) => {
    const [inRecycleBin, setInRecycleBin] = useState<boolean>(false);
    const [recycleBinItemCount, setRecycleBinItemCount] = useState<number>(0);

    // To keep the count updated
    useEffect(() => {
        const fetchRecycleBinCount = async () => {
            try {
                const recycleBin = await db.recycleBin.get("-1");
                setRecycleBinItemCount(recycleBin?.childrenCount ?? 0);
            } catch (error) {
                toast.error("Failed to load recycle bin information.", {
                    toastId: "error",
                });
            }
        };

        fetchRecycleBinCount();
    }, []);

    // Function to handle moving an item to the recycle bin.
    const DeleteFileFolder = async (data: { id: string }) => {
        const itemToDelete = await db.filesAndFolders.get(data.id);

        if (!itemToDelete) {
            throw new Error("Folder/File doesn't exist!");
        }

        try {
            // Move the item to the recycle bin and update the parent's child count.
            await db.recycleBin.add(
                {
                    ...itemToDelete,
                    parentId: "-1",
                    lastModifiedTime: new Date(),
                },
                itemToDelete.id
            );

            // Add to the count of recycle bin
            const parentFolder = await db.recycleBin.get("-1");
            const updatedRecycleBinCount = (parentFolder?.childrenCount ?? 0) + 1;
            await db.recycleBin.update("-1", {
                childrenCount: updatedRecycleBinCount,
                lastModifiedTime: new Date(),
            });
            setRecycleBinItemCount(updatedRecycleBinCount);

            // Delete the original item and update the parent's children count if necessary.
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
            toast.error(getErrorMessage(error), {
                toastId: "error",
            });
        }
    };

    // Permanently deletes an item from the recycle bin, including all descendants.
    const PermanentlyDeleteFileFolder = async (data: { id: string }) => {
        try {
            // Perform transactional deletion, ensuring that all references are removed.
            await db.transaction("rw", [db.recycleBin, db.filesAndFolders], async () => {
                const itemToDelete = await db.recycleBin.get(data.id);
                if (!itemToDelete) {
                    throw new Error("Folder/File doesn't exist in the recycle bin!");
                }

                // Delete all descendants of the item from the recycle bin
                // Assuming parentLineage includes the id of the item itself
                await db.filesAndFolders
                    .where("parentLineage")
                    .startsWith(itemToDelete.parentLineage + "/" + data.id)
                    .delete();

                // Delete the item itself
                await db.recycleBin.delete(data.id);

                // Subtract from the count of recycle bin
                const parentFolder = await db.recycleBin.get("-1");
                const updatedRecycleBinCount = (parentFolder?.childrenCount ?? 1) - 1;
                await db.recycleBin.update("-1", {
                    childrenCount: updatedRecycleBinCount,
                    lastModifiedTime: new Date(),
                });
                setRecycleBinItemCount(updatedRecycleBinCount);
            });
        } catch (error) {
            toast.error(getErrorMessage(error), {
                toastId: "error",
            });
        }
    };

    // Restores an item from the recycle bin to its last known parent, or to "Home" if the parent no longer exists.
    const RestoreFileFolder = async (data: { id: string }) => {
        try {
            const itemToRestore = await db.recycleBin.get(data.id);
            if (!itemToRestore) {
                throw new Error("Folder/File doesn't exist in the recycle bin!");
            }

            // Verify the parent exists or reset to "Home".
            const parentLineage = itemToRestore.parentLineage.split("/");
            const lastKnownParentId = parentLineage[parentLineage.length - 1];
            itemToRestore.parentId = lastKnownParentId;
            let parentFolder = await db.filesAndFolders.get(lastKnownParentId);

            // If the original parent doesn't exist anymore, reset to "Home"
            if (!parentFolder) {
                toast.warning('Parent directory does not exist. Restoring to "Home".', {
                    toastId: "warning",
                });
                itemToRestore.parentId = "0";
                itemToRestore.parentLineage = "0";
                parentFolder = await db.filesAndFolders.get(itemToRestore.parentId);
            }

            const dupCheck = await db.filesAndFolders.get({
                name: itemToRestore.name,
                parentId: parentFolder?.id,
                isFolder: itemToRestore.isFolder,
            });
            if (dupCheck) {
                throw new Error("Encountered duplicate item while restoring, please rename first and then restore!");
            }

            itemToRestore.lastModifiedTime = new Date();

            // Transactionally restore the item and update the parent
            await db.transaction("rw", [db.filesAndFolders, db.recycleBin], async () => {
                // Add the item back to files/folders
                await db.filesAndFolders.add(itemToRestore);
                // Remove the item from the recycle bin
                await db.recycleBin.delete(data.id);

                // Subtract from the count of recycle bin
                const recycleBin = await db.recycleBin.get("-1");
                const updatedRecycleBinCount = (recycleBin?.childrenCount ?? 1) - 1;
                await db.recycleBin.update("-1", {
                    childrenCount: updatedRecycleBinCount,
                    lastModifiedTime: new Date(),
                });
                setRecycleBinItemCount(updatedRecycleBinCount);

                // Update parent folder's children count and last modified time
                const updatedChildrenCount = (parentFolder?.childrenCount ?? 0) + 1;
                await db.filesAndFolders.update(parentFolder?.id, {
                    childrenCount: updatedChildrenCount,
                    lastModifiedTime: new Date(),
                });
            });
        } catch (error) {
            toast.error(getErrorMessage(error), {
                toastId: "error",
            });
        }
    };

    // Empties all items from the recycle bin, including any descendants of those items.
    const EmptyRecycleBin = async () => {
        try {
            await db.transaction("rw", [db.recycleBin, db.filesAndFolders], async () => {
                // Retrieve all items from the recycle bin
                const itemsInRecycleBin = await db.recycleBin.where({ parentId: "-1" }).toArray();

                // Iterate over each item and delete it along with its descendants
                for (const item of itemsInRecycleBin) {
                    // Delete all descendants of the item, including the item itself
                    await db.filesAndFolders
                        .where("parentLineage")
                        .startsWith(item.parentLineage + "/" + item.id)
                        .delete();
                }

                // Clear all items in the recycle bin.
                await db.recycleBin.where({ parentId: "-1" }).delete();

                await db.recycleBin.update("-1", {
                    childrenCount: 0,
                    lastModifiedTime: new Date(),
                });
                setRecycleBinItemCount(0);

                // Optionally clear all items if the parent folder is "Home" and it's empty.
                if (!(await db.filesAndFolders.where({ parentId: "0" }).count())) {
                    await db.filesAndFolders.clear();
                    // Re-add the "Home" folder if it was removed.
                    await db.filesAndFolders.add({
                        id: "0",
                        name: "Home",
                        isFolder: 1,
                        parentLineage: "",
                        parentId: "-2",
                        childrenCount: 0,
                        lastModifiedTime: new Date(),
                        size: 0,
                    });
                }
            });
        } catch (error) {
            toast.error(getErrorMessage(error), {
                toastId: "error",
            });
        }
    };

    return (
        <RecycleBin.Provider
            value={{
                recycleBinItemCount,
                inRecycleBin,
                setRecycleBinItemCount,
                setInRecycleBin,
                DeleteFileFolder,
                PermanentlyDeleteFileFolder,
                RestoreFileFolder,
                EmptyRecycleBin,
            }}
        >
            {children}
        </RecycleBin.Provider>
    );
};
