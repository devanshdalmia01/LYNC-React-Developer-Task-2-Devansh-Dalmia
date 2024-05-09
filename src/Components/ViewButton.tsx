import { MouseEvent, FC, memo } from "react";
import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";
import { VIEW } from "../Types/enums";
import { useViewTypeFilterSort } from "../Hooks/hooks";

/**
 * A button component that toggles between grid and list views in the application.
 * It uses the VIEW enum to determine which icon to display and what action to perform.
 */
const GridButton: FC<{ type: VIEW }> = memo(({ type }) => {
    // Hook to access and set the current view type.
    const { view, setView } = useViewTypeFilterSort();

    return (
        <button
            className={`w-[46px] h-[46px] flex items-center justify-center rounded-full ${
                view === type ? "bg-primary" : ""
            }`}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                setView(type);
            }}
        >
            {type === VIEW.GRID ? (
                <TbLayoutGrid className={`${view === type ? "text-white" : "text-gray-400"} text-xl`} />
            ) : (
                <TbLayoutList className={`${view === type ? "text-white" : "text-gray-400"} text-xl`} />
            )}
        </button>
    );
});

export default GridButton;
