import { createSlice } from "@reduxjs/toolkit";
import {
    MainDataType,
    NewFileFolderActionPayloadType,
    RenameFileFolderActionPayloadType,
    DeleteRestoreFileFolderActionPayloadType,
    ExpandCollapseActionPayloadType,
    ActiveFolderType,
} from "../Utils/interface";
import { v4 as uuidv4 } from "uuid";

// TODO Check memory leaks
const dataSlice = createSlice({
    name: "data",
    initialState: {
        explorerItems: {
            "0": { name: "Home", isFolder: true, parentId: "-1", isExpanded: true },
        },
        recycleBinItems: {},
        currentPath: [{ id: "0", isActive: true }],
        inRecycleBin: false,
    },
    reducers: {
        NewFileFolder(state: MainDataType, action: NewFileFolderActionPayloadType) {
            const { name, isFolder, parentId }: { name: string; isFolder: boolean; parentId: string } = action.payload;

            if (!name.length) {
                throw new Error("Please enter something.");
            }
            if (!state.explorerItems[parentId]) {
                throw new Error("Parent folder does not exist.");
            }
            const siblings = Object.values(state.explorerItems).filter((item) => item.parentId === parentId);
            if (siblings.some((item) => item.name === name && item.isFolder === isFolder)) {
                throw new Error(
                    `A ${!isFolder ? "file" : "folder"} with the same name already exists in this directory.`
                );
            }
            const newId = uuidv4();
            isFolder
                ? (state.explorerItems[newId] = {
                      name,
                      isFolder,
                      parentId,
                      isExpanded: false,
                  })
                : (state.explorerItems[newId] = {
                      name,
                      isFolder,
                      parentId,
                  });
        },
        RenameFileFolder(state: MainDataType, action: RenameFileFolderActionPayloadType) {
            const { id, newName }: { id: string; newName: string } = action.payload;
            if (!newName.length) {
                throw new Error("Please enter something.");
            }
            const item = state.explorerItems[id];
            if (!item) {
                throw new Error("File/Folder not found.");
            }
            const siblings = Object.entries(state.explorerItems)
                .filter(([key, value]) => value.parentId === item.parentId && key !== id)
                .map(([_, value]) => value);
            if (siblings.some((it) => it.name === newName && it.isFolder === item.isFolder)) {
                throw new Error(
                    `Another ${item.isFolder ? "folder" : "file"} in the same directory already has this name.`
                );
            }
            state.explorerItems[id] = { ...item, name: newName };
        },
        DeleteFile(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.explorerItems[id];
            if (!item) {
                throw new Error("File not found!");
            }
            state.explorerItems = Object.fromEntries(
                Object.entries(state.explorerItems).filter(([key, _]) => key !== id)
            );
            state.recycleBinItems[id] = {
                ...item,
            };
        },
        RestoreFile(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.recycleBinItems[id];
            if (!item) {
                throw new Error("File not found in recycle bin!");
            }
            state.recycleBinItems = Object.fromEntries(
                Object.entries(state.recycleBinItems).filter(([key, _]) => key !== id)
            );
            state.explorerItems[id] = {
                ...item,
            };
        },
        DeleteFolder(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.explorerItems[id];
            if (!item) {
                throw new Error("Folder not found!");
            }
            let newItems = { ...state.explorerItems };
            let newRecycleBin = { ...state.recycleBinItems };
            function recurseDelete(itemId: string) {
                const children = Object.entries(newItems).filter(([_, value]) => value.parentId === itemId);
                children.forEach(([childId, _]) => {
                    recurseDelete(childId);
                });
                newRecycleBin[itemId] = newItems[itemId];
                delete newItems[itemId];
            }
            recurseDelete(id);
            state.explorerItems = newItems;
            state.recycleBinItems = newRecycleBin;
        },
        RestoreFolder(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.recycleBinItems[id];
            if (!item) {
                throw new Error("Folder not found in recycle bin!");
            }
            let newItems = { ...state.explorerItems };
            let newRecycleBin = { ...state.recycleBinItems };
            function recurseRestore(itemId: string) {
                const children = Object.entries(newRecycleBin).filter(([_, value]) => value.parentId === itemId);
                children.forEach(([childId, _]) => {
                    recurseRestore(childId);
                });
                newItems[itemId] = newRecycleBin[itemId];
                delete newRecycleBin[itemId];
            }
            recurseRestore(id);
            state.explorerItems = newItems;
            state.recycleBinItems = newRecycleBin;
        },
        EmptyRecycleBin(state: MainDataType) {
            if (!Object.keys(state.recycleBinItems).length) {
                throw new Error("Recycle bin empty!");
            }
            Object.keys(state.recycleBinItems).forEach((id: string) => delete state.recycleBinItems[id]);
        },
        PermanentDeleteFile(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.recycleBinItems[id];
            if (!item) {
                throw new Error("File not found in recycle bin!");
            }
            delete state.recycleBinItems[id];
        },
        PermanentDeleteFolder(state: MainDataType, action: DeleteRestoreFileFolderActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.recycleBinItems[id];
            if (!item) {
                throw new Error("Folder not found in recycle bin!");
            }
            let newRecycleBin = { ...state.recycleBinItems };
            function recursiveDelete(itemId: string) {
                const children = Object.entries(newRecycleBin).filter(([_, value]) => value.parentId === itemId);
                children.forEach(([childId, _]) => {
                    recursiveDelete(childId);
                });
                delete newRecycleBin[itemId];
            }
            recursiveDelete(id);
            state.recycleBinItems = newRecycleBin;
        },
        ChangeRootFolder(state: MainDataType) {
            state.inRecycleBin = !state.inRecycleBin;
        },
        ChangeParent(state, action) {},
        ChangeCurrentPath(state, action) {},
        ExpandFolder(state: MainDataType, action: ExpandCollapseActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.explorerItems[id];
            if (!item) {
                throw new Error("Folder not found!");
            }
            if (!item.isFolder) {
                throw new Error("Not a folder!");
            }
            state.explorerItems[id] = { ...item, isExpanded: true };
        },
        CollapseFolder(state: MainDataType, action: ExpandCollapseActionPayloadType) {
            const { id }: { id: string } = action.payload;
            const item = state.explorerItems[id];
            if (!item) {
                throw new Error("Folder not found!");
            }
            if (!item.isFolder) {
                throw new Error("Not a folder!");
            }
            state.explorerItems[id] = { ...item, isExpanded: false };
        },
        GoToPreviousFolder(state: MainDataType) {
            let activePos: number = state.currentPath.findIndex((item: ActiveFolderType) => item.isActive);
            state.currentPath[activePos].isActive = false;
            state.currentPath[activePos - 1].isActive = true;
        },
        GoToNextFolder(state: MainDataType) {
            let activePos: number = state.currentPath.findIndex((item: ActiveFolderType) => item.isActive);
            state.currentPath[activePos].isActive = false;
            state.currentPath[activePos + 1].isActive = true;
        },
    },
});

export const {
    NewFileFolder,
    RenameFileFolder,
    DeleteFile,
    RestoreFile,
    DeleteFolder,
    RestoreFolder,
    EmptyRecycleBin,
    PermanentDeleteFile,
    PermanentDeleteFolder,
    ChangeRootFolder,
    ChangeParent,
    ChangeCurrentPath,
    ExpandFolder,
    CollapseFolder,
    GoToPreviousFolder,
    GoToNextFolder,
} = dataSlice.actions;

export default dataSlice.reducer;
