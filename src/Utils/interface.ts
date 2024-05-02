export interface FileFolderType {
    name: string;
    isFolder: boolean;
    parentId: string;
    isExpanded?: boolean;
}

export interface ExplorerItemsType {
    [key: string]: FileFolderType;
}

export interface RecycleBinItemsType extends ExplorerItemsType {}

export interface MainDataType {
    explorerItems: ExplorerItemsType;
    recycleBinItems: RecycleBinItemsType;
    currentLocation: string[];
    selectedObjects: string[];
}

export interface FileFolderPropType {
    itemId?: string;
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
