import { ButtonConfig, ModalConfig } from "./interface";
import { FaEdit, FaFileUpload, FaUndo } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiFillFolderAdd } from "react-icons/ai";
import { IoArrowBackCircleSharp } from "react-icons/io5";

// Enum to define different views such as grid and list.
export enum VIEW {
    GRID,
    LIST,
}

// Enum to filter by file type, either files or folders, or both.
export enum TYPE_FILTER {
    FILE_FOLDER = "both",
    FOLDER = "folder",
    FILE = "file",
}

// Enum to specify sorting criteria for file and folder listings.
export enum SORT_TYPE {
    NAME = "name",
    LAST_MODIFIED = "lastModifiedTime",
    SIZE = "size",
}

// Enum for sorting order, either ascending or descending.
export enum SORT_ORDER {
    ASCENDING,
    DESCENDING,
}

// Enum defining the types of modals that can be used in the application.
export enum MODALS {
    UPLOAD_FILE,
    NEW_FOLDER,
    RENAME_FILE,
    RENAME_FOLDER,
    DELETE_FILE,
    DELETE_FOLDER,
    PERMANENT_DELETE_FILE,
    PERMANENT_DELETE_FOLDER,
    EMPTY_BIN,
    NULL, // Represents no modal
}

// Enum for different button types in the UI, defining their functional context.
export enum BUTTONS {
    UPLOAD_FILE_BUTTON,
    NEW_FOLDER_BUTTON,
    RENAME_BUTTON,
    RENAME_OPTION_BUTTON,
    DELETE_BUTTON,
    DELETE_OPTION_BUTTON,
    PERMANENT_DELETE_OPTION_BUTTON,
    PERMANENT_DELETE_BUTTON,
    EMPTY_BIN_BUTTON,
    RESTORE_BUTTON,
    RESTORE_OPTION_BUTTON,
    BACK_BUTTON,
}

// Configuration objects for each type of modal dialog used in the application.
export const ModalInfo: Record<MODALS, ModalConfig> = {
    [MODALS.DELETE_FILE]: {
        title: "Delete File",
        description: "Do you want to send this file to Recycle Bin?",
        rejectButton: "No",
        acceptButton: "Yes",
    },
    [MODALS.DELETE_FOLDER]: {
        title: "Delete Folder",
        description: "Do you want to send this folder to Recycle Bin?",
        rejectButton: "No",
        acceptButton: "Yes",
    },
    [MODALS.UPLOAD_FILE]: {
        title: "Upload New File",
        description: "Select the file",
        rejectButton: "Cancel",
        acceptButton: "Add",
    },
    [MODALS.NEW_FOLDER]: {
        title: "Create New Folder",
        description: "Enter name of the folder",
        rejectButton: "Cancel",
        acceptButton: "Create",
    },
    [MODALS.PERMANENT_DELETE_FILE]: {
        title: "Permanently Delete File",
        description: "Do you want to permanently delete this file?",
        rejectButton: "No",
        acceptButton: "Yes",
    },
    [MODALS.PERMANENT_DELETE_FOLDER]: {
        title: "Permanently Delete Folder",
        description: "Do you want to permanently delete this folder?",
        rejectButton: "No",
        acceptButton: "Yes",
    },
    [MODALS.RENAME_FILE]: {
        title: "Rename File",
        description: "Enter new name of the File",
        rejectButton: "Cancel",
        acceptButton: "Change",
    },
    [MODALS.RENAME_FOLDER]: {
        title: "Rename Folder",
        description: "Enter new name of the Folder",
        rejectButton: "Cancel",
        acceptButton: "Change",
    },
    [MODALS.EMPTY_BIN]: {
        title: "Empty Bin",
        description: "Do you want to empty Recycle Bin?",
        rejectButton: "No",
        acceptButton: "Yes",
    },
    [MODALS.NULL]: {
        title: "NULL",
        description: "NULL",
        rejectButton: "NULL",
        acceptButton: "NULL",
    },
};

// CSS classes for different types of buttons used throughout the application.
const buttonWithTextClass: string =
    "flex justify-center items-center w-[150px] bg-white border-[1px] border-gray-400 pb-2 pt-2.5 px-3 text-lg font-semibold rounded-full text-secondary mr-3";
const buttonWithTextIconClass: string = "text-xl -mt-1 text-primary";
const buttonWithIconClass: string = "text-xl";
const buttonWithOnlyIcon: string =
    "flex w-[46px] h-[46px] items-center justify-center rounded-full bg-primary text-white";
const optionButtonClass: string = "group flex w-full pl-2 text-center items-center gap-2 py-1 px-1 hover:bg-gray-100";
const optionButtonIconClass: string = "-mt-1 text-primary";

// Configuration objects for each type of button in the application.
export const ButtonInfo: Record<BUTTONS, ButtonConfig> = {
    [BUTTONS.UPLOAD_FILE_BUTTON]: {
        text: "Upload File",
        className: buttonWithTextClass,
        conditionalClassName: "",
        icon: <FaFileUpload className={buttonWithTextIconClass} />,
    },
    [BUTTONS.NEW_FOLDER_BUTTON]: {
        text: "Add Folder",
        className: buttonWithTextClass,
        conditionalClassName: "",
        icon: <AiFillFolderAdd className={buttonWithTextIconClass} />,
    },
    [BUTTONS.DELETE_BUTTON]: {
        text: "",
        className: buttonWithOnlyIcon,
        conditionalClassName: "invisible",
        icon: <MdDelete className={buttonWithIconClass} />,
    },
    [BUTTONS.EMPTY_BIN_BUTTON]: {
        text: "Empty Bin",
        className: buttonWithTextClass,
        conditionalClassName: "",
        icon: <MdDelete className={buttonWithTextIconClass} />,
    },
    [BUTTONS.PERMANENT_DELETE_BUTTON]: {
        text: "",
        className: buttonWithOnlyIcon,
        conditionalClassName: "invisible",
        icon: <MdDelete className={buttonWithIconClass} />,
    },
    [BUTTONS.RENAME_BUTTON]: {
        text: "",
        className: buttonWithOnlyIcon,
        conditionalClassName: "invisible",
        icon: <FaEdit className={buttonWithIconClass} />,
    },
    [BUTTONS.RESTORE_BUTTON]: {
        text: "",
        className: buttonWithOnlyIcon,
        conditionalClassName: "invisible",
        icon: <FaUndo className={buttonWithIconClass} />,
    },
    [BUTTONS.RENAME_OPTION_BUTTON]: {
        text: "Rename",
        className: optionButtonClass,
        conditionalClassName: "",
        icon: <FaEdit className={optionButtonIconClass} />,
    },
    [BUTTONS.DELETE_OPTION_BUTTON]: {
        text: "Delete",
        className: optionButtonClass,
        conditionalClassName: "",
        icon: <MdDelete className={optionButtonIconClass} />,
    },
    [BUTTONS.PERMANENT_DELETE_OPTION_BUTTON]: {
        text: "Permanent Delete",
        className: optionButtonClass,
        conditionalClassName: "",
        icon: <MdDelete className={optionButtonIconClass} />,
    },
    [BUTTONS.RESTORE_OPTION_BUTTON]: {
        text: "Restore",
        className: optionButtonClass,
        conditionalClassName: "",
        icon: <FaUndo className={optionButtonIconClass} />,
    },
    [BUTTONS.BACK_BUTTON]: {
        text: "Go Back",
        className:
            "flex justify-center items-center w-[125px] bg-white border-[1px] border-gray-400 pb-1 pt-1.5 px-3 text-md font-medium rounded-full text-secondary",
        conditionalClassName: "",
        icon: <IoArrowBackCircleSharp className={buttonWithTextIconClass} />,
    },
};
