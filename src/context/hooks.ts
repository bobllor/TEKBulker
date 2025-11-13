import React, { useEffect } from "react"
import "../pywebview";
import { APISettings } from "../pywebviewTypes";

async function getSettings(): Promise<APISettings>{
    const data: APISettings = await window.pywebview.api.init_settings();
    return data;
}

/**
 * Hook to initialize the settings context.
 * @param setApiSettings State setter function for initializing the settings of the program.
 */
export function useInitSettings(setApiSettings: SettingsProps["setApiSettings"]){
    useEffect(() => {
        getSettings().then((res) => {
            setApiSettings(res);
        })
    }, [])
}

type SettingsProps = {
    setApiSettings: React.Dispatch<React.SetStateAction<APISettings>>,
    updateSettings: boolean,
    setUpdateSettings: React.Dispatch<React.SetStateAction<boolean>>,
}