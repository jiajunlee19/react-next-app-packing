'use client'

import { deleteUser, updateUser } from "@/app/_actions/auth";
import SubmitButton from "@/app/_components/basic/button_submit";
import { signOut, useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";

export default function UserComponent({ params }: { params: {user_uid: string} }) {

    const { data: session } = useSession();

    if (!session || session.user.user_uid !== params.user_uid) {
        redirect("/denied");
    }

    const searchParams = useSearchParams();
    const callBackUrl = searchParams.get('callbackUrl') || '/';

    const formRef = useRef<HTMLFormElement>(null);
    const passwordRef = useRef("");

    const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {

        const input = window.prompt("Are you sure to delete this user?\nIf yes, enter 'delete' to confirm, this action cannot be undone.")
        if (input?.toLowerCase() !== 'delete') {
            e.preventDefault();
            return;
        }
    };

    return (
        <>
            <h1>Manage User</h1>
            
            <form ref={formRef} action={ async (formData) => {
                        const result = await updateUser(formData);
                        if (result?.error && result?.message) {
                            toast.error(result.message);
                        }
                        else if (result?.message) {
                            toast.success(result.message);
                        }
                        formRef.current?.reset();
                    }
                }>
                <input name="user_uid" type="text" value={session.user.user_uid} hidden readOnly formNoValidate />
                <label htmlFor="email">Email: </label>
                <input name="email" type="email" value={session.user.email} readOnly required formNoValidate />
                <label htmlFor="password">Password: </label>
                <input name="password" type="password" placeholder="Enter your password" onChange={(e) => passwordRef.current = e.target.value} autoComplete="off" required formNoValidate />
                <label htmlFor="role">Role: </label>
                <input name="role" type="role" value={session.user.role} readOnly required formNoValidate />
                <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-4" buttonTitle="Update" onButtonClick={() => null} submitingButtonTitle="Updating" />
                <button type="button" className="btn-cancel w-40 mr-4 mt-4" onClick={() => formRef.current?.reset()}>Reset</button>
            </form>

            <form action={ async () => {
                        const result = await deleteUser(session.user.user_uid);
                        if (result?.error && result?.message) {
                            toast.error(result.message);
                        }
                        else if (result?.message) {
                            toast.success(result.message);
                            await signOut({
                                redirect: true,
                                callbackUrl: callBackUrl,
                            });
                        }
                    }
                }>
                <SubmitButton buttonClass="btn-cancel w-80 mr-4 mt-8" buttonTitle={"Delete " + session.user.email} onButtonClick={handleSubmitClick} submitingButtonTitle="Deleting" />
            </form>
        </>
    );
};