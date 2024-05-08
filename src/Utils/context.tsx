import { createContext } from "react";
import {
    SelectedItemContextType,
    ModalContextType,
    ViewTypeFilterSortOrderContextType,
    FileFoldersContextType,
    RecycleBinContextType,
    CurrentLocationContextType,
} from "./interface";
import { VIEW, TYPE_FILTER, SORT_TYPE, SORT_ORDER, MODALS } from "./enums";

export const SelectedItem = createContext<SelectedItemContextType>({
    id: "",
    name: "",
    isFolder: 0,
    setId: () => {},
    setName: () => {},
    setIsFolder: () => {},
});

export const Modal = createContext<ModalContextType>({
    isOpen: false,
    type: MODALS.NULL,
    data: "",
    acceptPressed: false,
    openModal: () => {},
    closeModal: () => {},
    setType: () => {},
    setData: () => {},
    setAcceptPressed: () => {},
});

export const ViewTypeFilterSort = createContext<ViewTypeFilterSortOrderContextType>({
    view: VIEW.GRID,
    typeFilter: TYPE_FILTER.FILE_FOLDER,
    sort: SORT_TYPE.NAME,
    order: SORT_ORDER.ASCENDING,
    setTypeFilter: () => {},
    setView: () => {},
    setSort: () => {},
    setOrder: () => {},
});

export const CurrentLocation = createContext<CurrentLocationContextType>({
    activePosition: 0,
    currentPath: ["0"],
    setActivePosition: () => {},
    setCurrentPath: () => {},
});

export const FileFolders = createContext<FileFoldersContextType>({
    GetMainData: async ({ parentId }) => [
        {
            id: "",
            name: "",
            isExpanded: false,
            isFolder: 0,
            parentId: parentId,
            parentLineage: [],
            childrenCount: 0,
            lastModifiedTime: new Date(),
            size: 0,
        },
    ],
    AddNewFileFolder: async () => {},
    RenameFileFolder: async () => {},
    DeleteFileFolder: async () => {},
});

export const RecycleBin = createContext<RecycleBinContextType>({
    inRecycleBin: false,
    setInRecycleBin: () => {},
    GetRecycleBinCount: async () => 0,
    RestoreFileFolder: async () => {},
    PermanentlyDeleteFileFolder: async () => {},
    EmptyRecycleBin: async () => {},
});
