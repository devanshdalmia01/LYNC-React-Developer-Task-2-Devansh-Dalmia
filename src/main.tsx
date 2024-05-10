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
} from "./Context/provider";
import "react-toastify/dist/ReactToastify.css"; // Styles for Toast notifications
import "./index.css"; // Global styles
import { initializeDB } from "./Utils/db";

// Create the root of the application and attach it to the DOM element with the id 'root'
initializeDB()
    .then(() =>
        ReactDOM.createRoot(document.getElementById("root")!).render(
            <>
                {/* Wrapping all components inside various context providers to manage global state */}
                {/* Provider for managing file and folder data and operations */}
                <FileFoldersProvider>
                    {/* Provider for managing the current navigational path */}
                    <CurrentLocationProvider>
                        {/* Provider for managing the state of the currently selected item */}
                        <SelectedItemProvider>
                            {/* Provider for managing the state related to the recycle bin */}
                            <RecycleBinProvider>
                                {/* Provider for managing filters and sort options */}
                                <ViewTypeFilterSortProvider>
                                    {/* Provider for handling modals throughout the application */}
                                    <ModalProvider>
                                        {/* Main routing setup of the application */}
                                        <Routes />
                                        {/* Toast notifications container with configurations */}
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
        )
    )
    .catch((error) => {
        console.error("Failed to initialize the app:", error);
    });
