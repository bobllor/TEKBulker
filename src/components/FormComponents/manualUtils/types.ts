export type ManualData = {
    id?: string,
    name?: string, 
    opco?: string,
}

export type FormStateProps = {
    state: boolean,
    func: React.Dispatch<React.SetStateAction<boolean>>
}

export type InputDataProps = {
    nameValue: string, 
    opcoValue: string
}