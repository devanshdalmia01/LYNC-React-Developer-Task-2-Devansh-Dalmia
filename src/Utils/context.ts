import { createContext } from "react";
import { SelectedItemContextType } from "./interface";

export const SelectedItem = createContext<SelectedItemContextType>({
    selectedItem: "",
    setSelectedItem: () => {},
});
