"use client"

import SubmitButton from "@/app/_components/basic/button_submit";
import toast from "react-hot-toast";

export default function ContactForm() {

    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const confirmMsg = "Are you sure to send your message ?"

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };

    };

    return (
        <form className="flex flex-col mt-6"
            action={async (formData) => {
                // mailto:to?cc=cc1,cc2&bcc=bcc&subject=s&body=b
                // linebreak = %0D%0A
                const from = formData.get('from');
                const message = formData.get('message');
                if (typeof(from) !== "string" || typeof(message) !== "string") {
                    toast.error("Invalid format provided !");
                }
                else {
                    toast.success("The message is forwarded as draft to your e-mail provider !")
                    window.open(`mailto:jiajunlee19@gmail.com?subject=${from}%20%5BContact%20from%20Portfolio%20%7C%20Jia%20Jun%20Lee%5D&body=${message}`);
                }   
            }}
        >
            <input name="from" type="text" placeholder="Enter your name" required formNoValidate />
            <textarea name="message" placeholder="Enter your message" required />
            <SubmitButton buttonClass="btn-primary w-40 mr-4 mt-4" buttonTitle="Submit" onButtonClick={handleSubmitClick} submitingButtonTitle="Submitting" />
        </form>
    );
};