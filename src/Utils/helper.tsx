import { useRef, FC, MouseEvent } from "react";
import useDoubleClick from "use-double-click";
import { DoubleClickDivPropType, FileFolderType } from "../Types/interface";
import { SORT_ORDER, SORT_TYPE } from "../Types/enums";
import { db } from "./db";
import memoizeOne from "memoize-one";

// Functional component to handle both single and double clicks on a div.
// It takes callbacks for single and double clicks, a CSS class, children elements, and the item associated with the events.
export const DoubleClickDiv: FC<DoubleClickDivPropType> = ({ singleClick, doubleClick, className, children, item }) => {
    const divRef = useRef<HTMLDivElement>(null); // Reference to the div element.

    // Hook to handle double click and single click with specified latency.
    useDoubleClick({
        onSingleClick: (e: MouseEvent<Element>) => singleClick(item, e),
        onDoubleClick: (e: MouseEvent<Element>) => doubleClick(item, e),
        ref: divRef,
        latency: 500, // Customizable latency for differentiating between single and double clicks.
    });

    return (
        <div className={className} ref={divRef}>
            {children}
        </div>
    );
};

// Computes the navigation path based on the current active position within an array of path segments.
const computePath = (activePosition: number, currentPath: string[]): string => {
    if (activePosition < 0 || activePosition >= currentPath.length) {
        return "Invalid position";
    }
    return `/folders/${currentPath.slice(0, activePosition + 1).join("/")}`;
};

// Returns a readable error message from an unknown error object.
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

// Fetches data from the database based on the given filters and sorting options.
export const fetchData = async ({
    parentId,
    isFolder,
    sort,
    order,
}: {
    parentId: string;
    isFolder: number;
    sort: SORT_TYPE;
    order: SORT_ORDER;
}): Promise<FileFolderType[]> => {
    const query =
        parentId === "-1"
            ? db.recycleBin.where({ parentId, isFolder })
            : db.filesAndFolders.where({ parentId, isFolder });

    if (order === SORT_ORDER.DESCENDING) {
        query.reverse();
    }

    return await query.sortBy(sort === SORT_TYPE.SIZE && isFolder === 1 ? "childrenCount" : sort);
};

// Formats a Date object into a human-readable string, including time and date.
function getDate(time: Date): string {
    const now: Date = new Date(time);
    let hours: number = now.getHours();
    let minutes: number = now.getMinutes();
    const ampm: string = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Converts 0 to 12 for 12-hour format.
    minutes = minutes < 10 ? 0 + minutes : minutes;
    const strTime: string = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;

    const month: number = now.getMonth() + 1; // months are zero indexed
    const day: number = now.getDate();
    const year: number = now.getFullYear();
    const strDate: string = `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;

    return `${strDate}, ${strTime}`;
}

// Converts a file size in bytes to a human-readable string with specified precision.
function getFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k: number = 1024;
    const dm: number = decimals < 0 ? 0 : decimals;
    const sizes: string[] = ["Bytes", "KB", "MB"];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// Memoizing using memoize-one
export const memoizedComputePath = memoizeOne(computePath);
export const memoizedGetDate = memoizeOne(getDate);
export const memoizedGetFileSize = memoizeOne(getFileSize);
