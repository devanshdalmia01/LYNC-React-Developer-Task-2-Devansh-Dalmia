import { FC, memo } from "react";
import Image_404_Text from "../Assets/404_Text.svg";
import Image_404 from "../Assets/404.svg";

const NotFoundPage: FC = memo(() => {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <img className="mb-10" width="400px" src={Image_404} alt="404_1" />
            <img className="mt-5" width="400px" src={Image_404_Text} alt="404_2" />
            <p className="pt-5">If you are hiring, do give a chance to interview and show my potential!💯 </p>
        </div>
    );
});

export default NotFoundPage;
