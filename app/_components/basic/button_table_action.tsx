"use client"

import SubmitButton from "@/app/_components/basic/button_submit";
import { type State, type StatePromise } from "@/app/_libs/types";
import { toast } from "react-hot-toast";

type TableActionButtonProps = {
    id: string,
    action: (id: string) => StatePromise,
    icon: React.JSX.Element, 
    confirmMsg?: string,
};

export default function TableActionButton({ id, action, icon, confirmMsg }: TableActionButtonProps ) {

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        if (!confirmMsg) {
            return
        }

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return // cancel submit
        };
        return
    };

    return (
        <form action={ async () => {
            const result = await action(id);
            if (result?.error && result?.message) {
                toast.error(result.message);
            }
            else if (result?.message) {
                toast.success(result.message);
            }
        }}>
            <SubmitButton buttonClass="btn-primary w-min p-1" buttonTitle={icon} onButtonClick={handleDeleteClick} submitingButtonTitle={icon} />
        </form>
    );
};