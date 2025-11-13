/* 
These will need to be updated manualyl whenever types.py is updated in the backend.
The related types found in both files must be 1:1.
*/

// obtained from types in the backend
export type APISettings = {
    output_dir: string,
    template: TemplateMap,
    format: Formatting,
}

export type TemplateMap = {
    enabled: boolean,
    text: string,
    words_to_replace: string,
}

export type Formatting = {
    format_type: "period" | "no space",
    format_case: "title" | "upper" | "lower",
    format_style: "first last" | "f last" | "first l",
}