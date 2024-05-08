import { useRef, FC, MouseEvent } from "react";
import useDoubleClick from "use-double-click";
import { DoubleClickDivPropType, FileFolderType } from "./interface";
import { SORT_ORDER, SORT_TYPE } from "./enums";
import { db } from "./db";

export const DoubleClickDiv: FC<DoubleClickDivPropType> = ({ singleClick, doubleClick, className, children, item }) => {
    const divRef = useRef<HTMLDivElement>(null);
    useDoubleClick({
        onSingleClick: (e: MouseEvent<Element>) => singleClick(item, e),
        onDoubleClick: (e: MouseEvent<Element>) => doubleClick(item, e),
        ref: divRef,
        latency: 500,
    });
    return (
        <div className={className} ref={divRef}>
            {children}
        </div>
    );
};

export const computePath = (activePosition: number, currentPath: string[]) => {
    if (activePosition < 0 || activePosition >= currentPath.length) {
        return "Invalid position";
    }
    return `/folders/${currentPath.slice(0, activePosition + 1).join("/")}`;
};

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

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
    return await query.sortBy(sort);
};

export function getDate(time: Date): string {
    const now: Date = new Date(time);
    let hours: number = now.getHours();
    let minutes: number = now.getMinutes();
    const ampm: string = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    const strTime: string = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;

    const month: number = now.getMonth() + 1; // months are zero indexed
    const day: number = now.getDate();
    const year: number = now.getFullYear();
    const strDate: string = `${month < 10 ? "0" + month : month}/${day < 10 ? "0" + day : day}/${year}`;

    return `${strDate}, ${strTime}`;
}

export function getFileSize(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k: number = 1024;
    const dm: number = decimals < 0 ? 0 : decimals;
    const sizes: string[] = ["Bytes", "KB", "MB"];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
