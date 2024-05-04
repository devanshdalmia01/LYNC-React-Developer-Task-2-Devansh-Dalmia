import { MouseEvent, FC, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { IoArrowBackCircleSharp, IoArrowForwardCircleSharp } from "react-icons/io5";
import { NavButtonPropType } from "../Utils/interface";
import { NAV_BUTTONS } from "../Utils/enums";
import { GoToNextFolder, GoToPreviousFolder } from "../redux/storingData";

const NavButton: FC<NavButtonPropType> = ({ type }: NavButtonPropType) => {
    let buttonText!: string, icon!: ReactElement;
    const dispatch = useDispatch();
    switch (type) {
        case NAV_BUTTONS.BACK_BUTTON:
            buttonText = "Go Back";
            icon = <IoArrowBackCircleSharp className="-mt-1 mr-2 text-primary" />;
            break;
        case NAV_BUTTONS.NEXT_BUTTON:
            buttonText = "Go Next";
            icon = <IoArrowForwardCircleSharp className="-mt-1 ml-2 text-primary" />;
            break;
    }
    return (
        <button
            className={`${
                NAV_BUTTONS.NEXT_BUTTON === type && "ml-auto"
            } flex items-center bg-white border-[1px] border-gray-400 pb-2 pt-2.5 px-6 text-lg font-semibold rounded-full text-secondary`}
            onClick={(e: MouseEvent) => {
                e.preventDefault();
                if (NAV_BUTTONS.BACK_BUTTON === type) {
                    dispatch(GoToPreviousFolder());
                } else {
                    dispatch(GoToNextFolder());
                }
                return;
            }}
        >
            {NAV_BUTTONS.BACK_BUTTON === type && icon}
            {buttonText}
            {NAV_BUTTONS.NEXT_BUTTON === type && icon}
        </button>
    );
};

export default NavButton;
