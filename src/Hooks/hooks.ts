import { useContext } from "react";
import { SelectedItem, Modal, ViewTypeFilterSort, CurrentLocation, FileFolders, RecycleBin } from "../Context/context";
import {
    SelectedItemContextType,
    ModalContextType,
    ViewTypeFilterSortOrderContextType,
    CurrentLocationContextType,
    FileFoldersContextType,
    RecycleBinContextType,
} from "../Types/interface";

// Custom hook for accessing the selected item context.
export const useSelectedItem = () => {
    // Utilizes useContext to fetch the context for selected items.
    const context = useContext<SelectedItemContextType>(SelectedItem);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useSelectedItem must be used within a SelectedItemProvider");
    }
    return context;
};

// Custom hook for accessing the modal context.
export const useModal = () => {
    // Utilizes useContext to fetch the context for modals.
    const context = useContext<ModalContextType>(Modal);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

// Custom hook for accessing the view type, filter, and sort order context.
export const useViewTypeFilterSort = () => {
    // Utilizes useContext to fetch the context related to view type, filter, and sorting.
    const context = useContext<ViewTypeFilterSortOrderContextType>(ViewTypeFilterSort);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useViewTypeFilterSort must be used within a ViewTypeFilterSortProvider");
    }
    return context;
};

// Custom hook for accessing the current location context.
export const useCurrentLocation = () => {
    // Utilizes useContext to fetch the context related to the current navigation location.
    const context = useContext<CurrentLocationContextType>(CurrentLocation);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useCurrentLocation must be used within a CurrentLocationProvider");
    }
    return context;
};

// Custom hook for accessing the file and folders context.
export const useFileFolders = () => {
    // Utilizes useContext to fetch the context for managing file and folder data.
    const context = useContext<FileFoldersContextType>(FileFolders);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useFileFolders must be used within a FileFolderProvider");
    }
    return context;
};

// Custom hook for accessing the recycle bin context.
export const useRecycleBin = () => {
    // Utilizes useContext to fetch the context for managing the recycle bin.
    const context = useContext<RecycleBinContextType>(RecycleBin);
    // Throws an error if the context is used outside of its provider scope.
    if (!context) {
        throw new Error("useFileFolders must be used within a RecycleBinProvider");
    }
    return context;
};
