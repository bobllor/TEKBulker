import React from "react"

export type SettingsButton = {
    label: string,
    url: string,
}

export type OptionProps = {
    label: string, // the key or opton to be displayed
    func: CallableFunction, // function that activates after a setting change
    type: "button" | "slider" | "text", // the value that will be used with func
    element?: React.ReactElement, // if given, it will display next to the label in HTML
}

export type OptionBaseProps = {
    title: string,
    options: Array<OptionProps>,
}