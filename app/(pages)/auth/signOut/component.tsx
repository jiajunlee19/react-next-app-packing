'use client'

import { signOut, useSession } from "next-auth/react";
import SubmitButton from "@/app/_components/basic/button_submit";
import { redirect, useSearchParams } from "next/navigation";

export default function SignOutComponent() {

    const { data: session } = useSession();

    if (!session) {
        redirect("/");
    }

    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get('callbackUrl') || '/';

    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        // const confirmMsg = "Are you sure to sign out?"

        // //if any button other than submit is clicked, preventDefault submit routing!
        // if (!window.confirm(confirmMsg)) {
        //     e.preventDefault();
        //     return;
        // };

    };

    return (
        <>
            <h1>Are you sure to sign out ?</h1>
            <form action={ async (formData) => {
                        const result = await signOut({
                            redirect: true,
                            callbackUrl: callBackUrl,
                        });
                    }
                }>
                <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-4" buttonTitle="Yes, sign me out" onButtonClick={handleSubmitClick} submitingButtonTitle="Signing Out" />
            </form>
        </>
    );
};