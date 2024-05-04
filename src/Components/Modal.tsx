import { FC, ChangeEvent, MouseEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
            title = `Create New ${type === MODALS.NEW_FOLDER ? "Folder" : "File"}`;
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
        <Transition appear show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                open={open}
                onClose={() => {
                    setOpen(false);
                    setData("");
                    setAccept(false);
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-1/3 h-72 p-8 rounded-3xl flex flex-col bg-white text-black">
                                <div className="flex-grow">
                                    <Dialog.Title as="h1" className={"text-start text-3xl font-bold mb-4"}>
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description className={"text-start text-lg font-medium"}>
                                        {description}
                                    </Dialog.Description>
                                    {/* TODO Check empty name */}
                                    {(type === MODALS.NEW_FILE ||
                                        type === MODALS.NEW_FOLDER ||
                                        type === MODALS.RENAME_FILE ||
                                        type === MODALS.RENAME_FOLDER) && (
                                        <input
                                            value={data}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                e.preventDefault();
                                                setData(e.target.value);
                                            }}
                                            type="text"
                                            className="mt-2.5 block focus:outline-none w-full rounded-md border-[1px] border-gray-400 px-3 py-2 text-gray-900"
                                        />
                                    )}
                                </div>
                                <div className="flex self-end">
                                    <button
                                        className="flex items-center bg-white border-[1px] border-gray-400 pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-secondary mr-5"
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
                                        className="flex items-center bg-primary border-[1px] pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-white"
                                        onClick={(e: MouseEvent) => {
                                            e.preventDefault();
                                            setAccept(true);
                                        }}
                                    >
                                        {acceptButton}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
