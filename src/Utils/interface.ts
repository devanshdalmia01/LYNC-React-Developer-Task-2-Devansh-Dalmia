import { BUTTONS, MODALS, NAV_BUTTONS, VIEW } from "./enums";
import { Dispatch, SetStateAction } from "react";

export interface FileFolderType {
    name: string;
    isFolder: boolean;
    parentId: string;
    isExpanded?: boolean;
}

export interface ExplorerItemsType {
    [key: string]: FileFolderType;
}

export interface ActiveFolderType {
    id: string;
    isActive: boolean;
}

export interface RecycleBinItemsType extends ExplorerItemsType {}

export interface MainDataType {
    explorerItems: ExplorerItemsType;
    recycleBinItems: RecycleBinItemsType;
    currentPath: ActiveFolderType[];
    selectedItems: string[];
    inRecycleBin: boolean;
}

export interface FileFolderPropType {
    itemId: string;
    item: FileFolderType;
}

export interface NewFileFolderActionPayloadType {
    payload: FileFolderType;
}

export interface RenameFileFolderActionPayloadType {
    payload: {
        id: string;
        newName: string;
    };
}

export interface DeleteRestoreFileFolderActionPayloadType {
    payload: {
        id: string;
    };
}

export interface ExpandCollapseActionPayloadType extends DeleteRestoreFileFolderActionPayloadType {}

export interface ButtonPropType {
    type: BUTTONS;
}

export interface NavButtonPropType {
    type: NAV_BUTTONS;
}

export interface ModalPropType {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    data: string;
    setData: Dispatch<SetStateAction<string>>;
    setAccept: Dispatch<SetStateAction<boolean>>;
    type: MODALS;
}

export interface MainAreaFileFolderPropType extends FileFolderPropType {
    view: VIEW;
}

export interface ViewPropType {
    view: VIEW;
}

export interface NavbarViewPropType {
    view: VIEW;
    setView: Dispatch<SetStateAction<VIEW>>;
}
