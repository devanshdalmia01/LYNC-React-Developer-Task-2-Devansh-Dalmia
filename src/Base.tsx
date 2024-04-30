import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

export default function Base({ children }: any) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
