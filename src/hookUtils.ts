import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router";

/**
 * Dismisses a component by using an HTML element for listening and
 * the setter state function of the component.
 * This is only used for components based off of routes and will auto navigate
 * to the root route.
 * 
 * @param element - Any HTMLElement, if it is null then this will return void.
 * @param setShowComponent - The set state function, it must be a boolean.
 * @returns void 
 */
export function useDismissRoute(
    targetRef: React.RefObject<HTMLElement|null>,
    setShowComponent: React.Dispatch<React.SetStateAction<boolean>>,
): void{
    const navigate: NavigateFunction = useNavigate()
    useEffect(() => {
        const element = targetRef.current;
        if(!element) return;

        const dismiss = () => {
            navigate("/");
            setShowComponent(false);
        }
        const onClick = (e: MouseEvent) => {
            if(e.target == element){
                dismiss();
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            switch(e.key){
                case "Escape":
                    dismiss();
                default:
                    return;
            }
        }

        element.addEventListener("click", onClick);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            element.removeEventListener("click", onClick);
            document.removeEventListener("keydown", onKeyDown);
        }
    }, [])
}