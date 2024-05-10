import { FC, memo } from "react";

const Footer: FC = memo(() => {
    return (
        <footer className="bg-transparent w-full h-[5vh] text-white flex">
            <h1 className="bg-secondary h-full w-[25vw] flex justify-center items-center">
                &copy; 2024&nbsp;
                <a
                    className="hover:text-gray-400"
                    href="https://www.linkedin.com/in/devanshdalmia1/"
                    rel="noreferrer"
                    target={"_blank"}
                >
                    Devansh Dalmia
                </a>
                &nbsp;| All Rights Reserved
            </h1>
            <div className="w-[75vw] h-full bg-gray-50"></div>
        </footer>
    );
});

export default Footer;
