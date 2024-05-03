import { MouseEvent, FC, useState, useEffect, ReactElement, useContext } from "react";
import { BUTTONS, MODALS } from "../Utils/enums";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";
import {
    MainDataType,
    ExplorerItemsType,
    ButtonPropType,
    ActiveFolderType,
    SelectedItemContextType,
    RecycleBinItemsType,
} from "../Utils/interface";
import {
    NewFileFolder,
    DeleteFile,
    DeleteFolder,
    RenameFileFolder,
    EmptyRecycleBin,
    PermanentDeleteFolder,
    PermanentDeleteFile,
} from "../redux/storingData";
import { toast } from "react-toastify";
import { getErrorMessage } from "../Utils/common";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { AiFillFileAdd, AiFillFolderAdd } from "react-icons/ai";
import { SelectedItem } from "../Utils/context";

const Button: FC<ButtonPropType> = ({ type }: ButtonPropType) => {
    let buttonText!: string, modalType!: MODALS, icon!: ReactElement;
    const dispatch = useDispatch();
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const recycleBinItems: RecycleBinItemsType = useSelector((state: MainDataType) => state["recycleBinItems"]);
    const currentFolder: string | undefined = useSelector(
        (state: MainDataType) => state["currentPath"].find((item: ActiveFolderType) => item.isActive)?.id
    );
    const { selectedItem, setSelectedItem } = useContext<SelectedItemContextType>(SelectedItem);
    const [accept, setAccept] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<string>("");
    useEffect(() => {
        if (accept) {
            try {
                switch (type) {
                    case BUTTONS.ADD_FOLDER:
                    case BUTTONS.ADD_FILE:
                        dispatch(
                            NewFileFolder({
                                name: data as string,
                                isFolder: BUTTONS.ADD_FILE === type ? false : true,
                                parentId: currentFolder as string,
                            })
                        );
                        break;
                    case BUTTONS.DELETE:
                        explorerItems[selectedItem].isFolder
                            ? dispatch(DeleteFolder({ id: selectedItem }))
                            : dispatch(DeleteFile({ id: selectedItem }));
                        break;
                    case BUTTONS.RENAME:
                        dispatch(
                            RenameFileFolder({
                                id: selectedItem,
                                newName: data as string,
                            })
                        );
                        break;
                    case BUTTONS.PERMANENT_DELETE:
                        recycleBinItems[selectedItem].isFolder
                            ? dispatch(PermanentDeleteFolder({ id: selectedItem }))
                            : dispatch(PermanentDeleteFile({ id: selectedItem }));
                        break;
                    case BUTTONS.EMPTY_BIN:
                        dispatch(EmptyRecycleBin());
                        break;
                }
                setData("");
                setAccept(false);
                setOpen(false);
                setSelectedItem("");
            } catch (error) {
                toast.error(getErrorMessage(error));
                setAccept(false);
                // TODO check Empty String
                if (data.length) {
                    setOpen(true);
                } else {
                    setOpen(false);
                }
            }
        }
    }, [accept]);
    switch (type) {
        case BUTTONS.ADD_FILE:
            buttonText = "Add File";
            modalType = MODALS.NEW_FILE;
            icon = <AiFillFileAdd className="-mt-1 text-primary" />;
            break;
        case BUTTONS.ADD_FOLDER:
            buttonText = "Add Folder";
            modalType = MODALS.NEW_FOLDER;
            icon = <AiFillFolderAdd className="-mt-1 text-primary" />;
            break;
        case BUTTONS.DELETE:
            buttonText = "Delete";
            modalType =
                explorerItems[selectedItem] !== undefined
                    ? explorerItems[selectedItem].isFolder
                        ? MODALS.DELETE_FOLDER
                        : MODALS.DELETE_FILE
                    : MODALS.NULL;
            icon = <MdDelete className="-mt-1 text-primary" />;
            break;
        case BUTTONS.RENAME:
            buttonText = "Rename";
            modalType =
                explorerItems[selectedItem] !== undefined
                    ? explorerItems[selectedItem].isFolder
                        ? MODALS.RENAME_FOLDER
                        : MODALS.RENAME_FILE
                    : MODALS.NULL;
            icon = <FaEdit className="-mt-1 text-primary" />;
            break;
        case BUTTONS.PERMANENT_DELETE:
            buttonText = "Permanently Delete";
            modalType =
                recycleBinItems[selectedItem] !== undefined
                    ? recycleBinItems[selectedItem].isFolder
                        ? MODALS.PERMANENT_DELETE_FOLDER
                        : MODALS.PERMANENT_DELETE_FILE
                    : MODALS.NULL;
            icon = <MdDelete className="-mt-1 text-primary" />;
            break;
        case BUTTONS.EMPTY_BIN:
            buttonText = "Empty Bin";
            modalType = MODALS.EMPTY_BIN;
            icon = <MdDelete className="-mt-1 text-primary" />;
            break;
    }
    return (
        <>
            <button
                className="flex items-center bg-quinary border-[1px] border-gray-400 pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-tertiary mr-10"
                onClick={(e: MouseEvent) => {
                    e.preventDefault();
                    if (modalType === MODALS.NULL) {
                        setOpen(false);
                        toast.error("Please select a file/folder first!");
                    } else {
                        setOpen(true);
                    }
                    return;
                }}
            >
                {icon}
                <span className="ml-2">{buttonText}</span>
            </button>
            <Modal open={open} setOpen={setOpen} data={data} setData={setData} setAccept={setAccept} type={modalType} />
        </>
    );
};

export default Button;
