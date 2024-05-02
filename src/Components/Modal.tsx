import { FC, ChangeEvent, MouseEvent } from "react";
import { Dialog } from "@headlessui/react";
import { ModalPropType } from "../Utils/interface";
import { MODALS } from "../Utils/enums";

const Modal: FC<ModalPropType> = ({ open, setOpen, data, setData, setAccept, type }: ModalPropType) => {
    let title!: string, description!: string, rejectButton!: string, acceptButton!: string;
    switch (type) {
        case MODALS.DELETE_FILE:
        case MODALS.DELETE_FOLDER:
            title = `Delete ${type === MODALS.DELETE_FOLDER ? "Folder" : "File"}`;
            description = `Do you want to send this ${
                type === MODALS.DELETE_FOLDER ? "folder" : "file"
            } to Recycle Bin?`;
            rejectButton = "No";
            acceptButton = "Yes";
            break;
        case MODALS.NEW_FILE:
        case MODALS.NEW_FOLDER:
            title = `New ${type === MODALS.NEW_FOLDER ? "Folder" : "File"}`;
            description = `Enter name of the ${type === MODALS.NEW_FOLDER ? "folder" : "file"}`;
            rejectButton = "Cancel";
            acceptButton = "Create";
            break;
        case MODALS.PERMANENT_DELETE_FILE:
        case MODALS.PERMANENT_DELETE_FOLDER:
            title = `Permanently Delete ${type === MODALS.PERMANENT_DELETE_FOLDER ? "Folder" : "File"}`;
            description = `Do you want to permanently delete this ${
                type === MODALS.PERMANENT_DELETE_FOLDER ? "folder" : "file"
            }?`;
            rejectButton = "No";
            acceptButton = "Yes";
            break;
        case MODALS.RENAME_FILE:
        case MODALS.RENAME_FOLDER:
            title = `Rename ${type === MODALS.RENAME_FOLDER ? "Folder" : "File"}`;
            description = `Enter new name of the ${type === MODALS.RENAME_FOLDER ? "Folder" : "File"}`;
            rejectButton = "Cancel";
            acceptButton = "Change";
            break;
        case MODALS.EMPTY_BIN:
            title = "Empty Bin";
            description = "Do you want to empty Recycle Bin?";
            rejectButton = "No";
            acceptButton = "Yes";
            break;
    }
    return (
        <Dialog
            className="relative z-50"
            open={open}
            onClose={() => {
                setOpen(false);
                setData("");
                setAccept(false);
            }}
        >
            <Dialog.Panel className="w-full max-w-sm rounded bg-black text-white">
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
                {(type === MODALS.NEW_FILE ||
                    type === MODALS.NEW_FOLDER ||
                    type === MODALS.RENAME_FILE ||
                    type === MODALS.RENAME_FOLDER) && (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Name
                        </label>
                        <div className="mt-2.5">
                            {/* TODO Check empty name */}
                            <input
                                value={data}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    setData(e.target.value);
                                }}
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="name"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                )}
                <button
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        setOpen(false);
                        setData("");
                        setAccept(false);
                    }}
                >
                    {rejectButton}
                </button>
                <button
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();
                        setAccept(true);
                    }}
                >
                    {acceptButton}
                </button>
            </Dialog.Panel>
        </Dialog>
    );
};

export default Modal;
