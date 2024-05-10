import { createContext } from "react";
import {
    SelectedItemContextType,
    ModalContextType,
    ViewTypeFilterSortOrderContextType,
    FileFoldersContextType,
    RecycleBinContextType,
    CurrentLocationContextType,
} from "../Types/interface";
import { VIEW, TYPE_FILTER, SORT_TYPE, SORT_ORDER, MODALS } from "../Types/enums";

// Context for managing the state of a selected item within the application.
export const SelectedItem = createContext<SelectedItemContextType>({
    id: "",
    name: "",
    isFolder: 0,
    setId: () => {}, // Stub function for setting Id.
    setName: () => {}, // Stub function for setting name.
    setIsFolder: () => {}, // Stub function for setting folder flag.
});

// Context for managing modal states, such as visibility and content.
export const Modal = createContext<ModalContextType>({
    openFileFinder: false,
    isOpen: false,
    type: MODALS.NULL,
    data: "",
    acceptPressed: false,
    openModal: () => {}, // Stub function to open a modal.
    closeModal: () => {}, // Stub function to close a modal.
    setType: () => {}, // Stub function to set the type of modal.
    setData: () => {}, // Stub function to set data in the modal.
    setAcceptPressed: () => {}, // Stub function to set the accept button pressed state.
    setOpenFileFinder: () => {},
});

// Context for managing the view preferences, filters, and sorting of lists.
export const ViewTypeFilterSort = createContext<ViewTypeFilterSortOrderContextType>({
    view: VIEW.GRID, // Default view type.
    typeFilter: TYPE_FILTER.FILE_FOLDER, // Default filter type.
    sort: SORT_TYPE.NAME, // Default sorting criteria.
    order: SORT_ORDER.ASCENDING, // Default sorting order.
    setTypeFilter: () => {}, // Stub function for setting type filter.
    setView: () => {}, // Stub function for setting view.
    setSort: () => {}, // Stub function for setting sort criteria.
    setOrder: () => {}, // Stub function for setting sort order.
});

// Context for managing the current location within the app's navigational hierarchy.
export const CurrentLocation = createContext<CurrentLocationContextType>({
    activePosition: 0, // Default active position in navigation.
    currentPath: ["0"], // Default path, starting at 'root'.
    setActivePosition: () => {}, // Stub function for setting active position.
    setCurrentPath: () => {}, // Stub function for setting current path.
});

// Context for managing operations related to files and folders.
export const FileFolders = createContext<FileFoldersContextType>({
    GetMainData: async ({ parentId }) => [
        {
            // Returns a placeholder for file/folder data.
            id: "",
            name: "",
            isFolder: 0,
            parentId: parentId,
            parentLineage: "",
            childrenCount: 0,
            lastModifiedTime: new Date(),
            size: 0,
        },
    ],
    AddNewFileFolder: async () => {}, // Stub function for adding a new file or folder.
    RenameFileFolder: async () => {}, // Stub function for renaming a file or folder.
});

// Context for managing operations related to the recycle bin.
export const RecycleBin = createContext<RecycleBinContextType>({
    recycleBinItemCount: 0, // Flag indicating current count of items in recycle bin
    inRecycleBin: false, // Flag to indicate if the view is currently showing recycle bin items.
    setRecycleBinItemCount: () => {}, // Function to get the count of items in the recycle bin.
    setInRecycleBin: () => {}, // Stub function to set the inRecycleBin flag.
    DeleteFileFolder: async () => {}, // Stub function for deleting a file or folder.
    RestoreFileFolder: async () => {}, // Stub function to restore a file or folder from the recycle bin.
    PermanentlyDeleteFileFolder: async () => {}, // Stub function to permanently delete a file or folder.
    EmptyRecycleBin: async () => {}, // Stub function to empty the recycle bin.
});
