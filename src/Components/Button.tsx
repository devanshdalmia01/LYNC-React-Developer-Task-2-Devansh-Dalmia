import { FC, MouseEvent } from "react";
import { BUTTONS, ButtonInfo, MODALS } from "../Utils/enums";
import { useModal, useSelectedItem } from "../Utils/customHooks";

const Button: FC<{ type: BUTTONS }> = ({ type }) => {
    const { id, isFolder, name } = useSelectedItem();
    const { openModal, setAcceptPressed } = useModal();
    const { text, className, conditionalClassName, icon } = ButtonInfo[type];
    const handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        switch (type) {
            case BUTTONS.NEW_FILE_BUTTON:
                openModal(MODALS.NEW_FILE);
                break;
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
                setAcceptPressed(true);
                openModal(MODALS.NULL);
                break;
            case BUTTONS.UPLOAD_FILE_BUTTON:
                openModal(MODALS.UPLOAD_FILE);
                break;
        }
    };
    return (
        <button
            className={`${className}${id.length === 0 ? ` ${conditionalClassName}` : ""}`}
            onClick={(e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                handleClick(e);
            }}
        >
            {icon}
            {text !== "" ? <span className="ml-2">{text}</span> : ""}
        </button>
    );
};

export default Button;
