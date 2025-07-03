export type ManualData = {
    id?: string,
    name?: string, 
    opco?: string,
}

export type FormStateProps = {
    state: boolean,
    func: React.Dispatch<React.SetStateAction<boolean>>
}