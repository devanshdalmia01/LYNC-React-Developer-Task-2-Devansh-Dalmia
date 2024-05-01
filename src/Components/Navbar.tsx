import Logo from "../Assets/file-explorer-logo.webp";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
    return (
        <header className="header">
            <section className="logo">
                <Link to="/">
                    <img src={Logo} alt="App Logo" height={60} />
                    File Explorer
                    <sub>by Devansh</sub>
                </Link>
            </section>
            <section className="breadcrumb">
                <Link to="/">Home</Link>
                <Link to="/">b</Link>
                <Link to="/">c</Link>
            </section>
            <section className="operations">
                <Button />
                <Button />
            </section>
        </header>
    );
}
