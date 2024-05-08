import { useContext } from "react";
import { SelectedItem, Modal, ViewTypeFilterSort, CurrentLocation, FileFolders, RecycleBin } from "./context";
import {
    SelectedItemContextType,
    ModalContextType,
    ViewTypeFilterSortOrderContextType,
    CurrentLocationContextType,
    FileFoldersContextType,
    RecycleBinContextType,
} from "./interface";

export const useSelectedItem = () => {
    const context = useContext<SelectedItemContextType>(SelectedItem);
    if (!context) {
        throw new Error("useSelectedItem must be used within a SelectedItemProvider");
    }
    return context;
};

export const useModal = () => {
    const context = useContext<ModalContextType>(Modal);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

export const useViewTypeFilterSort = () => {
    const context = useContext<ViewTypeFilterSortOrderContextType>(ViewTypeFilterSort);
    if (!context) {
        throw new Error("useViewTypeFilterSort must be used within a ViewTypeFilterSortProvider");
    }
    return context;
};

export const useCurrentLocation = () => {
    const context = useContext<CurrentLocationContextType>(CurrentLocation);
    if (!context) {
        throw new Error("useCurrentLocation must be used within a CurrentLocationProvider");
    }
    return context;
};

export const useFileFolders = () => {
    const context = useContext<FileFoldersContextType>(FileFolders);
    if (!context) {
        throw new Error("useFileFolders must be used within a FileFolderProvider");
    }
    return context;
};

export const useRecycleBin = () => {
    const context = useContext<RecycleBinContextType>(RecycleBin);
    if (!context) {
        throw new Error("useFileFolders must be used within a RecycleBinProvider");
    }
    return context;
};
