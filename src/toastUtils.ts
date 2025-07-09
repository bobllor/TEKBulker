import toast from "react-hot-toast";

export function toastError(msg: string, duration: number = 3000): void{
    toast.error(
        msg, {duration: duration}
    )
}

export function toastSuccess(msg: string, duration: number = 3000): void{
    toast.success(
        msg, {duration: duration}
    )
}