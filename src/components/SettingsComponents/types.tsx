import React from "react"

export type SettingsButton = {
    label: string,
    url: string,
}

export type OptionProps = {
    label: string, // the option to be displayed
    func: () => void, // function that activates after a setting change
    type: "button" | "slider" | "text", // the value that will be used with func
    element?: React.ReactElement, // if given, it will display next to the label in HTML
    elementName?: string, // used for naming the HTML element in the form, it is used as an arg in the function call
}

export type OptionBaseProps = {
    title: string,
    options: Array<OptionProps>,
    readerType?: "opco" | "settings" | "excel" , // used for indicating what reader to be targeted in the backend
}