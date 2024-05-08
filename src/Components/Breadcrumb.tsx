import { MouseEvent, FC, Fragment, useState, useEffect } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { useCurrentLocation } from "../Utils/customHooks";
import { db } from "../Utils/db";
import { useNavigate } from "react-router-dom";
import { computePath } from "../Utils/common";

const Breadcrumb: FC = () => {
    const navigate = useNavigate();
    const [names, setNames] = useState<string[]>([""]);
    const { activePosition, currentPath } = useCurrentLocation();
    const getNames = async () => {
        let temp: string[] = [];
        for (const key in currentPath) {
            temp.push((await db.filesAndFolders.get(currentPath[key]))?.name as string);
        }
        setNames(temp);
    };
    useEffect(() => {
        if (currentPath.length === 1) {
            setNames(["Home"]);
            return;
        }
        getNames();
    }, [currentPath]);
    return names.map((value: string, index) => {
        return (
            index <= activePosition && (
                <Fragment key={index}>
                    {index === 0 && <TiHome className="-mt-1 text-2xl mr-1.5" />}
                    {!(index === 0) && <FaChevronRight className="mx-[4px]" />}
                    <button
                        className="text-2xl font-semibold"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            e.preventDefault();
                            navigate(computePath(index, currentPath));
                            return;
                        }}
                    >
                        {index === activePosition ? value : value.slice(0, 5)}
                    </button>
                </Fragment>
            )
        );
    });
};

export default Breadcrumb;
