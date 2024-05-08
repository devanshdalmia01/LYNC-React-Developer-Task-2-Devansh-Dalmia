import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { ToastContainer } from "react-toastify";
import {
    SelectedItemProvider,
    ModalProvider,
    ViewTypeFilterSortProvider,
    FileFoldersProvider,
    RecycleBinProvider,
    CurrentLocationProvider,
} from "./Utils/provider";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <>
        <FileFoldersProvider>
            <CurrentLocationProvider>
                <SelectedItemProvider>
                    <RecycleBinProvider>
                        <ViewTypeFilterSortProvider>
                            <ModalProvider>
                                <Routes />
                                <ToastContainer
                                    theme="colored"
                                    position="bottom-center"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    pauseOnFocusLoss
                                    pauseOnHover
                                />
                            </ModalProvider>
                        </ViewTypeFilterSortProvider>
                    </RecycleBinProvider>
                </SelectedItemProvider>
            </CurrentLocationProvider>
        </FileFoldersProvider>
    </>
);
