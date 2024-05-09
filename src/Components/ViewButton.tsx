import { MouseEvent, FC, memo } from "react";
import { TbLayoutGrid, TbLayoutList } from "react-icons/tb";
import { VIEW } from "../Types/enums";
import { useViewTypeFilterSort } from "../Hooks/hooks";

const GridButton: FC<{ type: VIEW }> = memo(({ type }) => {
    const { view, setView } = useViewTypeFilterSort();
    return (
        <button
            className={`w-[46px] h-[46px] flex items-center justify-center rounded-full ${
                view === type && "bg-primary"
            }`}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                setView(type);
                return;
            }}
        >
            {type ? (
                <TbLayoutList className={`${view === type ? "text-white" : "text-gray-400"} text-xl`} />
            ) : (
                <TbLayoutGrid className={`${view === type ? "text-white" : "text-gray-400"} text-xl`} />
            )}
        </button>
    );
});

export default GridButton;
