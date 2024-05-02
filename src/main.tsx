import ReactDOM from "react-dom/client";
import Routes from "./Routes";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Routes />
            <ToastContainer
                theme="colored"
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                pauseOnFocusLoss
                pauseOnHover
            />
        </PersistGate>
    </Provider>
);
