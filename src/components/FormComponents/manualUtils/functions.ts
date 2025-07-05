import React, { Dispatch } from "react";
import { InputDataProps } from "./types";
import { ManualData } from "./types";
import { formInputs } from "./vars";

export async function addEntry(
    divRef: React.RefObject<HTMLDivElement|null>,
    setData: Dispatch<React.SetStateAction<ManualData[]>>): Promise<void>{
    if(!divRef.current) return;

    const children: HTMLCollection = divRef.current!.children;
    const objTemp: ManualData = {};

    const objProps: Array<string> = ['name', 'opco'];

    // used to handle the first input element comparisons with the next
    let firstInput: null|HTMLInputElement = null;
    let firstInputVal: null|string = null;
    
    const inputElements: Array<HTMLInputElement> = [];

    // put this in your notes buddy
    for(let i = 0; i < children.length; i++){
        const input: Element = children[i];
        if(input instanceof HTMLInputElement){
            // FIXME: add an alert for these errors
            if(input.value.trim() == '' && input.id.includes('name')){
                return;
            }
            if(firstInputVal == input.value){
                return;
            }
            
            if(!firstInput && !firstInputVal){
                firstInput = input;
                firstInputVal = input.value;
            }

            if(formInputs[i].name == input.id){
                objTemp[objProps[i]] = input.value;
                
                inputElements.push(input);
            }
        }
    }

    // only resets the values if successful
    for(const input of inputElements){
        input.value = '';
    }

    firstInput?.focus();
    
    const id: string = Date.now().toString();
    objTemp['id'] = id;

    setData(prev => [...prev, objTemp]);
}

export function validateInput(event: React.ChangeEvent<HTMLInputElement>,
    setInputData: React.Dispatch<React.SetStateAction<InputDataProps>>, 
    setDisableSubmit: React.Dispatch<React.SetStateAction<boolean>>){
        const elementName: string = event.currentTarget.name;
        const currValue: string = event.currentTarget.value;

        setInputData(prev => {
            const otherKey: string = Object.keys(prev).filter((key) => {return key != elementName})[0];
            const otherVal: string = prev[otherKey];
            
            if(otherVal == currValue && otherVal != '' && currValue != ''){
                setDisableSubmit(true);
            }else{
                setDisableSubmit(false);
            }

            return {...prev, [elementName]: currValue}
        })
}

export function showInput(): void{
    
}