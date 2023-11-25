'use client'

import { useRef } from "react";
import { toast } from "react-hot-toast";
import { signUp } from "@/app/_actions/auth";
import SubmitButton from "@/app/_components/basic/button_submit";
import { signIn, useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";

export default function SignUpComponent() {

    const { data: session } = useSession();

    if (session) {
        redirect("/");
    }

    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get('callbackUrl') || '/';

    const formRef = useRef<HTMLFormElement>(null);
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const confirmMsg = "Are you sure to sign up?"

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };

    };

    return (
        <>
            <h1>Sign Up</h1>
            <form ref={formRef} action={ async (formData) => {
                        const result = await signUp(emailRef.current, passwordRef.current);
                        formRef.current?.reset();
                        if (result?.error && result?.message) {
                            toast.error(result.message);
                        }
                        else if (result?.message) {
                            toast.success(result.message);
                            await signIn("credentials", {
                                email: emailRef.current,
                                password: passwordRef.current,
                                redirect: true,
                                callbackUrl: callBackUrl,
                            });
                        }
                    }
                }>
                <label htmlFor="email">Email: </label>
                <input name="email" type="email" placeholder="Enter your email" onChange={(e) => emailRef.current = e.target.value} required formNoValidate />
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" placeholder="Enter your password" onChange={(e) => passwordRef.current = e.target.value} autoComplete="off" required formNoValidate />
                <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-4" buttonTitle="Sign Up" onButtonClick={handleSubmitClick} submitingButtonTitle="Signing Up" />
                <button type="button" className="btn-cancel w-40 mr-4 mt-4" onClick={() => formRef.current?.reset()}>reset</button>
            </form>
        </>
    );
};