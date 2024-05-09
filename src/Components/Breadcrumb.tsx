import { MouseEvent, FC, Fragment, useState, useEffect, memo } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { useCurrentLocation } from "../Hooks/hooks";
import { db } from "../Utils/db";
import { useNavigate } from "react-router-dom";
import { memoizedComputePath } from "../Utils/helper";

// Memoized Breadcrumb component to prevent re-renders unless necessary
const Breadcrumb: FC = memo(() => {
    const navigate = useNavigate();

    const { activePosition, currentPath } = useCurrentLocation();

    const [names, setNames] = useState<string[]>([]);

    // Function to fetch the names of all folders up to the current active position
    const getNames = async () => {
        const folderNames = await Promise.all(
            currentPath.map((id) => db.filesAndFolders.get(id).then((file) => file?.name || "Unknown"))
        );
        setNames(folderNames);
    };

    // Effect to update breadcrumb names when the current path changes
    useEffect(() => {
        if (currentPath.length === 1) {
            setNames(["Home"]); // Display "Home" when at the root level
        } else {
            getNames();
        }
    }, [currentPath]);

    return names.map(
        (name, index) =>
            index <= activePosition && (
                <Fragment key={index}>
                    {/* Home icon for the root */}
                    {index === 0 && <TiHome className="-mt-1 text-2xl mr-1.5" />}
                    {/* Chevron icon separator between items */}
                    {index > 0 && <FaChevronRight className="mx-[4px]" />}
                    <button
                        className="text-2xl font-semibold"
                        onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            e.preventDefault();
                            navigate(memoizedComputePath(index, currentPath)); // Navigate to the clicked path segment
                        }}
                    >
                        {name}
                    </button>
                </Fragment>
            )
    );
});

export default Breadcrumb;
