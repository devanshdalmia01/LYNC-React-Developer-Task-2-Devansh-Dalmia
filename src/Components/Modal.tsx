import { FC, ChangeEvent, MouseEvent, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Description, Transition, TransitionChild } from "@headlessui/react";
import { MODALS, ModalInfo } from "../Types/enums";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { getErrorMessage } from "../Utils/helper";
import { useParams } from "react-router-dom";
import { useFileFolders, useRecycleBin, useSelectedItem, useModal } from "../Hooks/hooks";

const Modal: FC = () => {
    const fileUploadRef = useRef<HTMLInputElement>(null);

    const { "*": splat } = useParams();

    const [openFileFinder, setOpenFileFinder] = useState<boolean>(true);

    const { AddNewFileFolder, RenameFileFolder } = useFileFolders();
    const { PermanentlyDeleteFileFolder, EmptyRecycleBin, RestoreFileFolder, DeleteFileFolder } = useRecycleBin();
    const { isOpen, type, data, acceptPressed, setData, closeModal, setAcceptPressed } = useModal();
    const { id, setId, setIsFolder, setName } = useSelectedItem();

    // Handle different modal confirmations based on the type
    const handleAccept = () => {
        let path: string[] = splat?.split("/").map((value) => value) as string[];
        switch (type) {
            case MODALS.UPLOAD_FILE:
            case MODALS.NEW_FOLDER:
                const fileInfo = {
                    id: uuidv4(),
                    name: data instanceof File ? data.name : (data as string),
                    isFolder: type === MODALS.NEW_FOLDER ? 1 : 0,
                    parentId: path[path.length - 1],
                    parentLineage: path,
                    lastModifiedTime: data instanceof File ? new Date(data.lastModified) : new Date(),
                    childrenCount: 0,
                    size: data instanceof File ? data.size : 0,
                };
                AddNewFileFolder(fileInfo)
                    .then(() => closeModal())
                    .catch((error) => {
                        toast.error(getErrorMessage(error));
                        setAcceptPressed(false);
                    });
                break;
            case MODALS.RENAME_FILE:
            case MODALS.RENAME_FOLDER:
                RenameFileFolder({
                    id: id,
                    name: data as string,
                })
                    .then(() => {
                        setId("");
                        setIsFolder(0);
                        setName("");
                        closeModal();
                    })
                    .catch((error) => {
                        toast.error(getErrorMessage(error));
                        setAcceptPressed(false);
                    });
                break;
            case MODALS.DELETE_FILE:
            case MODALS.DELETE_FOLDER:
                DeleteFileFolder({
                    id: id,
                })
                    .catch((error) => {
                        toast.error(getErrorMessage(error));
                    })
                    .finally(() => {
                        setId("");
                        setIsFolder(0);
                        setName("");
                        closeModal();
                    });
                break;
            case MODALS.PERMANENT_DELETE_FILE:
            case MODALS.PERMANENT_DELETE_FOLDER:
                PermanentlyDeleteFileFolder({
                    id: id,
                })
                    .catch((error) => {
                        toast.error(getErrorMessage(error));
                    })
                    .finally(() => {
                        setId("");
                        setIsFolder(0);
                        setName("");
                        closeModal();
                    });
                break;
            case MODALS.EMPTY_BIN:
                EmptyRecycleBin()
                    .catch((error) => {
                        toast.error(getErrorMessage(error));
                    })
                    .finally(() => {
                        closeModal();
                    });
                break;
            case MODALS.NULL:
                RestoreFileFolder({
                    id: id,
                })
                    .catch((error) => toast.error(getErrorMessage(error)))
                    .finally(() => {
                        setId("");
                        setIsFolder(0);
                        setName("");
                        setAcceptPressed(false);
                    });
                break;
        }
    };

    // Auto-trigger handleAccept when acceptPressed changes to true
    useEffect(() => {
        if (acceptPressed) {
            handleAccept();
        }
    }, [acceptPressed]);

    // Prevent modal rendering if it is not open or if the type is MODALS.NULL
    if (!isOpen || type === MODALS.NULL) return null;

    const { title, description, rejectButton, acceptButton } = ModalInfo[type];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-20"
                open={isOpen}
                onClose={() => {
                    closeModal();
                }}
                onFocus={() => {
                    if (
                        openFileFinder &&
                        type === MODALS.UPLOAD_FILE &&
                        data instanceof File &&
                        data.name.length === 0
                    ) {
                        fileUploadRef.current?.click();
                        setOpenFileFinder(false);
                    }
                }}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-1/3 h-72 p-8 rounded-3xl flex flex-col bg-white text-black">
                                <div className="flex-grow">
                                    <DialogTitle as="h1" className={"text-start text-3xl font-bold mb-4"}>
                                        {title}
                                    </DialogTitle>
                                    <Description className={"text-start text-lg font-medium"}>
                                        {description}
                                    </Description>
                                    {(type === MODALS.NEW_FOLDER ||
                                        type === MODALS.RENAME_FILE ||
                                        type === MODALS.RENAME_FOLDER) && (
                                        <input
                                            data-autofocus
                                            value={data as string}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setData(e.target.value);
                                            }}
                                            type="text"
                                            className="mt-2.5 w-full rounded-md border-[1px] border-gray-400 px-3 py-2 text-gray-900"
                                        />
                                    )}
                                    {type === MODALS.UPLOAD_FILE && (
                                        <input
                                            ref={fileUploadRef}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                if (e.target.files) {
                                                    setData(e.target.files[0]);
                                                }
                                            }}
                                            type="file"
                                            className="mt-2.5 w-full rounded-md border-[1px] border-gray-400 px-3 py-2 text-gray-900"
                                        />
                                    )}
                                </div>
                                <div className="flex self-end">
                                    <button
                                        className="flex items-center bg-white border-[1px] border-gray-400 pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-secondary mr-5"
                                        onClick={(e: MouseEvent) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            closeModal();
                                        }}
                                    >
                                        {rejectButton}
                                    </button>
                                    <button
                                        className="flex items-center bg-primary border-[1px] pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-white"
                                        onClick={(e: MouseEvent) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setAcceptPressed(true);
                                        }}
                                    >
                                        {acceptButton}
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
