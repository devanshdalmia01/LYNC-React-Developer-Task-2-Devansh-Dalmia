import { FC } from "react";
import { FileFolderPropType } from "../Utils/interface";

const File: FC<FileFolderPropType> = ({ item }) => {
    return <div className="file">📄 {item.name}</div>;
};

export default File;
