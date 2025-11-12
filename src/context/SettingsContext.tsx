import { JSX } from "react";
import { useContext, createContext, useState } from "react";
import { UploadedFilesProps } from "../components/FileComponents/utils/types";

const SettingsContext = createContext<SettingsData>({
    uploadedFiles: [],
    setUploadedFiles: () => {}
});

export const useSettingsContext = () => useContext(SettingsContext);

export function SettingsProvider({ children }: {children: JSX.Element}): JSX.Element {
    const data: SettingsData = {

    }
    
    return (
        <>
            <SettingsContext.Provider value={data}>
                {children}
            </SettingsContext.Provider>
        </>
    )
}

type SettingsData = {

}