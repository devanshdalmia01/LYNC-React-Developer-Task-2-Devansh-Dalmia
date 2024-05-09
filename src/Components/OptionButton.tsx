import { FC, MouseEvent } from "react";
import { BUTTONS } from "../Types/enums";
import { Menu, MenuButton, MenuItems, Transition } from "@headlessui/react";
import { HiDotsVertical } from "react-icons/hi";
import Button from "./Button";
import { useRecycleBin } from "../Hooks/hooks";
import { FileFolderType } from "../Types/interface";

/**
 * A component that renders an options button with a context menu for each file or folder item.
 * It adjusts the available options based on whether the item is in the recycle bin or not.
 */
const OptionButton: FC<{
    onSingleClick: (item: FileFolderType, e: MouseEvent, option: string) => void;
    item: FileFolderType;
}> = ({ onSingleClick, item }) => {
    const { inRecycleBin } = useRecycleBin(); // Determine if the current view is the recycle bin.

    return (
        <Menu>
            <MenuButton
                className="hover:bg-gray-200 p-1 transition ease-out duration-150 rounded-full text-md text-gray-600"
                onClick={(e: MouseEvent) => {
                    // Trigger callback for option selection.
                    onSingleClick(item, e, "option");
                }}
            >
                <HiDotsVertical />
            </MenuButton>
            <Transition
                enter="transition ease-out duration-75"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                {/* Conditionally render menu items based on the recycle bin state */}
                <MenuItems
                    anchor="bottom end"
                    className={`${
                        !inRecycleBin ? "w-28" : "w-40"
                    } h-18 shadow-md origin-top-right border-[1px] rounded-md bg-white text-sm/6 text-black [--anchor-gap:var(--spacing-1)]`}
                >
                    <Button type={!inRecycleBin ? BUTTONS.RENAME_OPTION_BUTTON : BUTTONS.RESTORE_OPTION_BUTTON} />
                    <div className="border-b-[1px]"></div>
                    <Button
                        type={!inRecycleBin ? BUTTONS.DELETE_OPTION_BUTTON : BUTTONS.PERMANENT_DELETE_OPTION_BUTTON}
                    />
                </MenuItems>
            </Transition>
        </Menu>
    );
};

export default OptionButton;
