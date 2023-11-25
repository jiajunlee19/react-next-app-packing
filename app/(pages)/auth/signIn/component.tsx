'use client'

import { useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import SubmitButton from "@/app/_components/basic/button_submit";
import { toast } from "react-hot-toast";
import { redirect, useSearchParams } from "next/navigation";

export default function SignInComponent() {

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

        const confirmMsg = "Are you sure to sign in?"

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };

    };

    return (
        <>
            <h1>Sign In</h1>
            <form ref={formRef} action={ async (formData) => {
                        const result = await signIn("credentials", {
                            email: emailRef.current,
                            password: passwordRef.current,
                            redirect: true,
                            callbackUrl: callBackUrl,
                        });
                        formRef.current?.reset();
                        
                        if (result?.error) {
                            toast.error("Invalid credentials provided !");
                        }
                    }
                }>
                <label htmlFor="email">Email: </label>
                <input name="email" type="email" placeholder="Enter your email" onChange={(e) => emailRef.current = e.target.value} required formNoValidate />
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" placeholder="Enter your password" onChange={(e) => passwordRef.current = e.target.value} autoComplete="off" required formNoValidate />
                <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-4" buttonTitle="Sign In" onButtonClick={handleSubmitClick} submitingButtonTitle="Signing In" />
                <button type="button" className="btn-cancel w-40 mr-4 mt-4" onClick={() => formRef.current?.reset()}>reset</button>
            </form>
        </>
    );
};