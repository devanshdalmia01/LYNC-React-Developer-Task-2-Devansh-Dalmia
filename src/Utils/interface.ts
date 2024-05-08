import { Dispatch, SetStateAction, ReactElement, MouseEvent } from "react";
import { SORT_ORDER, SORT_TYPE, TYPE_FILTER, VIEW, MODALS } from "./enums";

export interface FileFolderType {
    id: string;
    name: string;
    isFolder: number;
    parentLineage: string[];
    isExpanded: boolean;
    parentId: string;
    lastModifiedTime: Date;
    childrenCount: number;
    size: number;
}

export interface SelectedItem {
    id: string;
    name: string;
    isFolder: number;
}

export interface SelectedItemContextType extends SelectedItem {
    setId: Dispatch<SetStateAction<string>>;
    setName: Dispatch<SetStateAction<string>>;
    setIsFolder: Dispatch<SetStateAction<number>>;
}

export interface ModalContextType {
    isOpen: boolean;
    type: MODALS;
    data: string | File;
    acceptPressed: boolean;
    openModal: (type: MODALS, data?: string) => void;
    closeModal: () => void;
    setType: Dispatch<SetStateAction<MODALS>>;
    setData: (data: string | File) => void;
    setAcceptPressed: Dispatch<SetStateAction<boolean>>;
}

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

export interface CurrentLocationContextType {
    activePosition: number;
    currentPath: string[];
    setActivePosition: Dispatch<SetStateAction<number>>;
    setCurrentPath: Dispatch<SetStateAction<string[]>>;
}

export interface FileFoldersContextType {
    GetMainData: (data: {
        parentId: string;
        sort: SORT_TYPE;
        type: TYPE_FILTER;
        order: SORT_ORDER;
    }) => Promise<FileFolderType[]>;
    AddNewFileFolder: (data: FileFolderType) => Promise<void>;
    RenameFileFolder: (data: { id: string; name: string }) => Promise<void>;
    DeleteFileFolder: (data: { id: string }) => Promise<void>;
}

export interface RecycleBinContextType {
    inRecycleBin: boolean;
    setInRecycleBin: Dispatch<SetStateAction<boolean>>;
    GetRecycleBinCount: () => Promise<number>;
    RestoreFileFolder: (data: { id: string }) => Promise<void>;
    PermanentlyDeleteFileFolder: (data: { id: string }) => Promise<void>;
    EmptyRecycleBin: () => Promise<void>;
}

export interface ProviderType {
    children: ReactElement | ReactElement[];
}

export interface ModalConfig {
    title: string;
    description: string;
    rejectButton: string;
    acceptButton: string;
}

export interface ButtonConfig {
    text: string;
    className: string;
    conditionalClassName: string;
    icon: ReactElement;
}

export interface DoubleClickDivPropType {
    singleClick: (item: SelectedItem, e: MouseEvent<Element>) => void;
    doubleClick: (item: SelectedItem, e: MouseEvent<Element>) => void;
    className: string;
    children: ReactElement[];
    item: SelectedItem;
}
