import Dexie, { Table } from "dexie";
import { FileFolderType } from "../Types/interface";

// Defines a class extending Dexie to manage a local IndexedDB database for file and folder management.
export class FileManagerDB extends Dexie {
    // Declares tables in the database for files/folders and items in the recycle bin.
    filesAndFolders!: Table<FileFolderType>;
    recycleBin!: Table<FileFolderType>;

    constructor() {
        super("FileManagerDB"); // Initializes a new Dexie database named "FileManagerDB".
        // Defines the database schema for version 1.
        this.version(1).stores({
            filesAndFolders: "&id, [name+parentId+isFolder], [parentId+isFolder], parentId", // Schema for the 'filesAndFolders' table.
            recycleBin: "&id, parentId, [parentId+isFolder]", // Schema for the 'recycleBin' table.
        });
    }
}

// Creates an instance of the FileManagerDB class.
export const db = new FileManagerDB();

// Performs a transaction on the database to add default entries for 'Home' and 'Recycle Bin'.
db.transaction("rw", [db.filesAndFolders, db.recycleBin], async () => {
    // Adds a default 'Home' folder entry to the 'filesAndFolders' table.
    await db.filesAndFolders.put(
        {
            id: "0", // Unique identifier for the Home folder.
            name: "Home", // Name of the folder.
            isFolder: 1, // Indicates this entry is a folder.
            isExpanded: true, // Initial state, expanded.
            parentLineage: [], // An empty array since 'Home' has no parents.
            parentId: "-2", // Parent Id, indicating no parent.
            childrenCount: 0, // Initially, no children.
            lastModifiedTime: new Date(), // Timestamp of creation.
            size: 0, // Size in bytes, zero for folders.
        },
        "0" // Key for the data entry.
    );

    // Adds a default 'Recycle Bin' entry to the 'recycleBin' table.
    await db.recycleBin.put(
        {
            id: "-1", // Unique identifier for the Recycle Bin.
            name: "Recycle Bin", // Name of the folder.
            isFolder: 1, // Indicates this entry is a folder.
            isExpanded: false, // Initial state, not expanded.
            parentLineage: [], // An empty array since 'Recycle Bin' has no parents.
            parentId: "-2", // Parent Id, indicating no parent.
            childrenCount: 0, // Initially, no children.
            lastModifiedTime: new Date(), // Timestamp of creation.
            size: 0, // Size in bytes, zero for folders.
        },
        "-1" // Key for the data entry.
    );
});
