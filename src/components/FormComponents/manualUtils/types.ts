export type ManualData = {
    name?: string, 
    opco?: string,
}

export type FormStateProps = {
    state: boolean,
    func: React.Dispatch<React.SetStateAction<boolean>>
}