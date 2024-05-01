import Base from "../Base";
import SideExplorer from "../Components/SideExplorer";
import MainExplorer from "../Components/MainExplorer";

export default function HomePage() {
    return (
        <Base>
            <nav className="">
                <SideExplorer />
            </nav>
            <MainExplorer />
        </Base>
    );
}
