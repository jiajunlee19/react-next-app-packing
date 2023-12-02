"use client"

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import SubmitButton from "@/app/_components/basic/button_submit";
import { type State, type StatePromise } from "@/app/_libs/types";
import { toast } from "react-hot-toast";

type ShipButtonProps = {
    shipId: string,
    shipAction: (shipId: string) => StatePromise, 
};

export default function ShipButton({ shipId, shipAction }: ShipButtonProps ) {

    const handleShipClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const confirmMsg = 'Are you sure to ship this item?'

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };
        return; //proceed to submit form
    };

    return (
        <form action={ async () => {
            const result = await shipAction(shipId);
            if (result?.error && result?.message) {
                toast.error(result.message);
            }
            else if (result?.message) {
                toast.success(result.message);
            }
        }}>
            <SubmitButton buttonClass="btn-primary w-min p-1" buttonTitle={<PaperAirplaneIcon className="h-5" />} onButtonClick={handleShipClick} submitingButtonTitle={<PaperAirplaneIcon className="h-5" />} />
        </form>
    );
};