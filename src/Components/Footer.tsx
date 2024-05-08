import { FC, memo } from "react";

const Footer: FC = memo(() => {
    return (
        <footer className="bg-secondary w-[390px] h-[39px] text-white text-center -mt-[39px]">
            <h1>
                &copy; 2024&nbsp;
                <a href="https://www.linkedin.com/in/devanshdalmia1/" rel="noreferrer" target={"_blank"}>
                    Devansh Dalmia
                </a>
                &nbsp;| All Rights Reserved
            </h1>
        </footer>
    );
});

export default Footer;
