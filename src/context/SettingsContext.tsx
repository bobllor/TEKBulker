import React, { JSX } from "react";
import { useContext, createContext, useState } from "react";
import { APISettings } from "../pywebviewTypes";
import { useInitSettings, useInitHeaders } from "./hooks";

const SettingsContext = createContext<SettingsData>({
    apiSettings: {} as APISettings,
    setApiSettings: () => {},
    headers: {} as HeaderData,
    setHeaders: () => {},
});

export const useSettingsContext = () => useContext(SettingsContext);

export function SettingsProvider({ children }: {children: JSX.Element}): JSX.Element {
    const [apiSettings, setApiSettings] = useState<APISettings>({} as APISettings);
    const [headers, setHeaders] = useState<HeaderData>({} as HeaderData);

    useInitSettings(setApiSettings);
    useInitHeaders(setHeaders);

    const data: SettingsData = {
        apiSettings,
        setApiSettings,
        headers,
        setHeaders,
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
    headers: HeaderData,
    setHeaders: React.Dispatch<React.SetStateAction<HeaderData>>,
}

export type HeaderData = {
    opco: string,
    name: string,
    country?: string,
}