import "./pywebview";

/**
 * Checks if the values of two objects are the same or different. 
 * @param obj - The base object.
 * @param objToCompare - The object for comparison.
 * @returns boolean 
 */
export function compareObjects(baseObj: Object, objToCompare: Object): boolean{
    let hasDifferentValue: boolean = false;

    const baseKeys: string[] = Object.keys(baseObj);

    for(let j = 0; j < baseKeys.length; j++){
        const key: string = baseKeys[j];

        const baseValue = baseObj[key as keyof typeof baseObj];
        const newValue = objToCompare[key as keyof typeof baseObj];

        if(baseValue != newValue){
            hasDifferentValue = true; 
            break;
        }
    }

    return hasDifferentValue;
}

/**
 * Generates a random ID.
 * @returns {string} The ID.
 */
export function generateId(): string{
    const id: string = Math.random().toString(16).slice(2);

    return id;
}

/**
 * Checks if the response of the backend call is successful. Requires the response to
 * have the key `status`.
 * @param res - The response object, map, or record.
 * @returns {boolean} - If the response is not successful.
 */
export function checkRes(res: Record<string, string>): boolean{
    return res["status"] == "success";
}