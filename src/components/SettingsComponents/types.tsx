import { JSX } from "react"

export type SettingsButton = {
    label: string,
    url: string,
}

export type OptionProps = {
    label: string, // the option to be displayed
    type: "button" | "slider" | "text", // the value that will be used with func
    element: JSX.Element, // the element to display after the label. this should be related to the backend call
    optLabel?: JSX.Element // an optional string that is displayed right next to the label.
}

export type OptionBaseProps = {
    title: string,
    options: Array<OptionProps>,
    readerType?: "opco" | "settings" | "excel" , // used for indicating what reader to be targeted in the backend
}