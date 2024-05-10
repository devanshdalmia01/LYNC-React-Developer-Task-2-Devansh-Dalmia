import { FC, MouseEvent } from "react";
import { BUTTONS, ButtonInfo, MODALS } from "../Types/enums";
import { useCurrentLocation, useModal, useRecycleBin, useSelectedItem } from "../Hooks/hooks";
import { useNavigate } from "react-router-dom";
import { memoizedComputePath } from "../Utils/helper";

// Component for rendering a button that triggers various modal dialogs and actions based on its type.
const Button: FC<{ type: BUTTONS }> = ({ type }) => {
    const navigate = useNavigate();

    const { inRecycleBin } = useRecycleBin();
    const { id, isFolder, name } = useSelectedItem(); // Context hook to get selected item details.
    const { openModal, setAcceptPressed } = useModal(); // Context hook to manage modal dialogs.
    const { activePosition, currentPath } = useCurrentLocation();

    // Extract button styling and content based on its type.
    const { text, className, conditionalClassName, icon } = ButtonInfo[type];

    // Handles click events on the button, triggering different actions based on button type.
    const handleClick = () => {
        switch (type) {
            case BUTTONS.NEW_FOLDER_BUTTON:
                openModal(MODALS.NEW_FOLDER);
                break;
            case BUTTONS.RENAME_OPTION_BUTTON:
            case BUTTONS.RENAME_BUTTON:
                openModal(isFolder ? MODALS.RENAME_FOLDER : MODALS.RENAME_FILE, name);
                break;
            case BUTTONS.DELETE_OPTION_BUTTON:
            case BUTTONS.DELETE_BUTTON:
                openModal(isFolder ? MODALS.DELETE_FOLDER : MODALS.DELETE_FILE);
                break;
            case BUTTONS.PERMANENT_DELETE_OPTION_BUTTON:
            case BUTTONS.PERMANENT_DELETE_BUTTON:
                openModal(isFolder ? MODALS.PERMANENT_DELETE_FOLDER : MODALS.PERMANENT_DELETE_FILE);
                break;
            case BUTTONS.EMPTY_BIN_BUTTON:
                openModal(MODALS.EMPTY_BIN);
                break;
            case BUTTONS.RESTORE_OPTION_BUTTON:
            case BUTTONS.RESTORE_BUTTON:
                setAcceptPressed(true); // Setting a flag when the restore action is initiated.
                openModal(MODALS.NULL); // Special case to handle restore without a specific modal dialog.
                break;
            case BUTTONS.UPLOAD_FILE_BUTTON:
                openModal(MODALS.UPLOAD_FILE, new File([""], "", { type: "text/html" }));
                break;
            case BUTTONS.BACK_BUTTON:
                navigate(inRecycleBin ? "/folders/0" : memoizedComputePath(activePosition - 1, currentPath));
                break;
        }
    };

    return (
        <button
            className={`${className}${id.length === 0 ? ` ${conditionalClassName}` : ""}`}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                handleClick();
            }}
        >
            {icon}
            {/* Conditionally render text span if there is text. */}
            {text && <span className="ml-2">{text}</span>}
        </button>
    );
};

export default Button;
