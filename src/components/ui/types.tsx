import React from "react"

export type ButtonProps = {
    text: string,
    bg?: string,
    bgHover?: string,
    paddingX: number,
    paddingY: number,
    func?: () => any,
}

export type SliderButtonProps = {
    status: boolean,
    statusSetter: React.Dispatch<React.SetStateAction<boolean>>,
}