import Dexie, { Table } from "dexie";
import { FileFolderType } from "./interface";

export class FileManagerDB extends Dexie {
    filesAndFolders!: Table<FileFolderType>;
    recycleBin!: Table<FileFolderType>;

    constructor() {
        super("FileManagerDB");
        this.version(1).stores({
            filesAndFolders: "&id, [name+parentId+isFolder], [parentId+isFolder], parentId",
            recycleBin: "&id, parentId, [parentId+isFolder]",
        });
    }
}

export const db = new FileManagerDB();

db.transaction("rw", [db.filesAndFolders, db.recycleBin], async () => {
    await db.filesAndFolders.put(
        {
            id: "0",
            name: "Home",
            isFolder: 1,
            isExpanded: true,
            parentLineage: [],
            parentId: "-2",
            childrenCount: 0,
            lastModifiedTime: new Date(),
            size: 0,
        },
        "0"
    );

    await db.recycleBin.put(
        {
            id: "-1",
            name: "Recycle Bin",
            isFolder: 1,
            isExpanded: false,
            parentLineage: [],
            parentId: "-2",
            childrenCount: 0,
            lastModifiedTime: new Date(),
            size: 0,
        },
        "-1"
    );
});
