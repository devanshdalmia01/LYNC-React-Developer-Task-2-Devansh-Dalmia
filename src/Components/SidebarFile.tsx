import { FC } from "react";
import { FileFolderPropType } from "../Utils/interface";

const SidebarFile: FC<FileFolderPropType> = ({ item }: FileFolderPropType) => {
    return <div className="file">📄 {item.name}</div>;
};

export default SidebarFile;
