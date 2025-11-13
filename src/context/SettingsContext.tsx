import React, { JSX } from "react";
import { useContext, createContext, useState } from "react";
import { APISettings } from "../pywebviewTypes";
import { useInitSettings } from "./hooks";

const SettingsContext = createContext<SettingsData>({
    apiSettings: {} as APISettings,
    setApiSettings: () => {},
});

export const useSettingsContext = () => useContext(SettingsContext);

export function SettingsProvider({ children }: {children: JSX.Element}): JSX.Element {
    const [apiSettings, setApiSettings] = useState<APISettings>({} as APISettings);

    useInitSettings(setApiSettings);

    const data: SettingsData = {
        apiSettings,
        setApiSettings,
    }
    
    return (
        <>
            <SettingsContext.Provider value={data}>
                {children}
            </SettingsContext.Provider>
        </>
    )
}

export type SettingsData = {
    apiSettings: APISettings,
    setApiSettings: React.Dispatch<React.SetStateAction<APISettings>>,
}