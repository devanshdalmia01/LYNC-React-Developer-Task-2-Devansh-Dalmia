import { MouseEvent, FC, useState, useEffect } from "react";
import { BUTTONS, MODALS } from "../Utils/enums";
import { useSelector, useDispatch } from "react-redux";
import Modal from "./Modal";
import { MainDataType, ExplorerItemsType, ButtonPropType } from "../Utils/interface";
import { NewFileFolder, DeleteFile, DeleteFolder, RenameFileFolder } from "../redux/storingData";
import { toast } from "react-toastify";
import { getErrorMessage } from "../Utils/common";

const Button: FC<ButtonPropType> = ({ type }: ButtonPropType) => {
    let buttonText: string, modalType: MODALS;
    const dispatch = useDispatch();
    const explorerItems: ExplorerItemsType = useSelector((state: MainDataType) => state["explorerItems"]);
    const currentLocation: string[] = useSelector((state: MainDataType) => state["currentLocation"]);
    const selectedItems: string[] = useSelector((state: MainDataType) => state["selectedItems"]);
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
                                parentId: currentLocation[currentLocation.length - 1],
                            })
                        );
                        break;
                    case BUTTONS.DELETE:
                        explorerItems[selectedItems[0]].isFolder
                            ? dispatch(DeleteFolder({ id: selectedItems[0] }))
                            : dispatch(DeleteFile({ id: selectedItems[0] }));
                        break;
                    case BUTTONS.RENAME:
                        dispatch(
                            RenameFileFolder({
                                id: selectedItems[0],
                                newName: data as string,
                            })
                        );
                        break;
                }
                // TODO Remove selection of item
                setData("");
                setAccept(false);
                setOpen(false);
            } catch (error) {
                toast.error(getErrorMessage(error));
                setAccept(false);
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
            break;
        case BUTTONS.ADD_FOLDER:
            buttonText = "Add Folder";
            modalType = MODALS.NEW_FOLDER;
            break;
        case BUTTONS.DELETE:
            buttonText = "Delete";
            modalType =
                selectedItems.length &&
                (explorerItems[selectedItems[0]].isFolder ? MODALS.DELETE_FOLDER : MODALS.DELETE_FILE);
            break;
        case BUTTONS.RENAME:
            buttonText = "Rename";
            modalType =
                selectedItems.length &&
                (explorerItems[selectedItems[0]].isFolder ? MODALS.RENAME_FOLDER : MODALS.RENAME_FILE);
            break;
    }
    return (
        <>
            <button
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
                {buttonText}
            </button>
            <Modal open={open} setOpen={setOpen} data={data} setData={setData} setAccept={setAccept} type={modalType} />
        </>
    );
};

export default Button;
