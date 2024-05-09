import { Dispatch, SetStateAction, ReactElement, MouseEvent } from "react";
import { SORT_ORDER, SORT_TYPE, TYPE_FILTER, VIEW, MODALS } from "./enums";

// Interface representing the structure of a file or folder.
export interface FileFolderType {
    id: string; // Unique identifier for the file or folder
    name: string; // Display name of the file or folder
    isFolder: number; // Flag indicating if it's a folder (e.g., 1 for folder, 0 for file)
    parentLineage: string[]; // Array of parent ids showing the path to this item
    parentId: string; // Id of the parent folder
    lastModifiedTime: Date; // Timestamp of the last modification
    childrenCount: number; // Number of items inside the folder
    size: number; // Size of the file in bytes
}

// Interface for an item selected by the user.
export interface SelectedItem {
    id: string; // Unique identifier for the selected item
    name: string; // Name of the selected item
    isFolder: number; // Indicates if the selected item is a folder
}

// Context type for managing the state of a selected item.
export interface SelectedItemContextType extends SelectedItem {
    setId: Dispatch<SetStateAction<string>>;
    setName: Dispatch<SetStateAction<string>>;
    setIsFolder: Dispatch<SetStateAction<number>>;
}

// Context for managing modal dialogs within the application.
export interface ModalContextType {
    isOpen: boolean; // Indicates if a modal is open
    type: MODALS; // Type of the modal to display
    data: string | File; // Data associated with the modal
    acceptPressed: boolean; // Flag indicating if the accept button was pressed
    openModal: (type: MODALS, data?: string) => void; // Function to open modal
    closeModal: () => void; // Function to close modal
    setType: Dispatch<SetStateAction<MODALS>>;
    setData: (data: string | File) => void;
    setAcceptPressed: Dispatch<SetStateAction<boolean>>;
}

// Context for controlling view settings, type filters, and sorting.
export interface ViewTypeFilterSortOrderContextType {
    view: VIEW;
    typeFilter: TYPE_FILTER;
    sort: SORT_TYPE;
    order: SORT_ORDER;
    setView: Dispatch<SetStateAction<VIEW>>;
    setTypeFilter: Dispatch<SetStateAction<TYPE_FILTER>>;
    setSort: Dispatch<SetStateAction<SORT_TYPE>>;
    setOrder: Dispatch<SetStateAction<SORT_ORDER>>;
}

// Context for managing the current location within the application's navigation.
export interface CurrentLocationContextType {
    activePosition: number; // Active index in the navigation path
    currentPath: string[]; // Array of strings representing the path
    setActivePosition: Dispatch<SetStateAction<number>>;
    setCurrentPath: Dispatch<SetStateAction<string[]>>;
}

// Context for managing file and folder operations.
export interface FileFoldersContextType {
    GetMainData: (data: {
        parentId: string;
        sort: SORT_TYPE;
        type: TYPE_FILTER;
        order: SORT_ORDER;
    }) => Promise<FileFolderType[]>;
    AddNewFileFolder: (data: FileFolderType) => Promise<void>;
    RenameFileFolder: (data: { id: string; name: string }) => Promise<void>;
}

// Context for managing the recycle bin's functionalities.
export interface RecycleBinContextType {
    inRecycleBin: boolean; // Flag indicating if the current view is recycle bin
    recycleBinItemCount: number; // Flag indicating current count of items in recycle bin
    setInRecycleBin: Dispatch<SetStateAction<boolean>>;
    setRecycleBinItemCount: Dispatch<SetStateAction<number>>;
    DeleteFileFolder: (data: { id: string }) => Promise<void>;
    RestoreFileFolder: (data: { id: string }) => Promise<void>;
    PermanentlyDeleteFileFolder: (data: { id: string }) => Promise<void>;
    EmptyRecycleBin: () => Promise<void>;
}

// Props type for providers, supporting multiple children.
export interface ProviderType {
    children: ReactElement | ReactElement[];
}

// Configuration for modal dialogs.
export interface ModalConfig {
    title: string;
    description: string;
    rejectButton: string;
    acceptButton: string;
}

// Configuration for buttons with dynamic styles.
export interface ButtonConfig {
    text: string;
    className: string;
    conditionalClassName: string;
    icon: ReactElement;
}

// Prop types for components handling double-click and single-click actions.
export interface DoubleClickDivPropType {
    singleClick: (item: SelectedItem, e: MouseEvent<Element>) => void;
    doubleClick: (item: SelectedItem, e: MouseEvent<Element>) => void;
    className: string;
    children: ReactElement[];
    item: SelectedItem;
}
