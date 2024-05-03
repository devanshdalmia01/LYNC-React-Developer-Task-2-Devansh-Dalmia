import { FC } from "react";
import { MainAreaFileFolderPropType } from "../Utils/interface";

const MainFile: FC<MainAreaFileFolderPropType> = ({ item }: MainAreaFileFolderPropType) => {
    return <div className="file">📄 {item.name}</div>;
};

export default MainFile;
