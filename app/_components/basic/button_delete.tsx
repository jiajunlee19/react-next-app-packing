"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import SubmitButton from "@/app/_components/basic/button_submit";
import { type State, type StatePromise } from "@/app/_libs/types";
import { toast } from "react-hot-toast";

type DeleteButtonProps = {
    deleteId: string,
    deleteAction: (deleteId: string) => StatePromise, 
};

export default function DeleteButton({ deleteId, deleteAction }: DeleteButtonProps ) {

    const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const confirmMsg = 'Are you sure to delete this item?'

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };
        return; //proceed to submit form
    };

    return (
        <form action={ async () => {
            const result = await deleteAction(deleteId);
            if (result?.error && result?.message) {
                toast.error(result.message);
            }
            else if (result?.message) {
                toast.success(result.message);
            }
        }}>
            <SubmitButton buttonClass="btn-primary w-min p-1" buttonTitle={<TrashIcon className="h-5" />} onButtonClick={handleDeleteClick} submitingButtonTitle={<TrashIcon className="h-5" />} />
        </form>
    );
};