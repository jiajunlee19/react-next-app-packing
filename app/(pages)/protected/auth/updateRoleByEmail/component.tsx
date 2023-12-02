'use client'

import { updateRoleAdmin } from "@/app/_actions/auth";
import SubmitButton from "@/app/_components/basic/button_submit";
import { type TReadUserWithoutPassAdminSchema } from "@/app/_libs/zod_auth";
import { useSession } from "next-auth/react";
import { redirect, useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { useDebouncedCallback } from 'use-debounce';

type TUpdateRoleComponentProps = {
    user: TReadUserWithoutPassAdminSchema | null,
};

export default function UpdateRoleComponent( {user}: TUpdateRoleComponentProps ) {

    const { data: session } = useSession();

    if (!session || (session.user.role !== 'boss' && session.user.role !== 'admin')) {
        redirect("/denied");
    }

    const formRef = useRef<HTMLFormElement>(null);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        // URLSearchParams is used for manipulating the URL query parameters
        const params = new URLSearchParams(searchParams);

        // set params with value and delete params if no value
        if (e.target.value) {
            params.set("email", e.target.value);
        }
        else {
            params.delete("email");
        }

        // replace url with params, without refreshing the page
        replace(`${pathname}?${params.toString()}`)

    };

    const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        
        const confirmMsg = 'Are you sure to update role for this user?'

        //if any button other than submit is clicked, preventDefault submit routing!
        if (!window.confirm(confirmMsg)) {
            e.preventDefault();
            return;
        };
        return; //proceed to submit form
    };

    return (
        <>
            <h1>Update Role</h1>
            <form ref={formRef} action={ async (formData) => {
                        const result = await updateRoleAdmin(formData);
                        if (result?.error && result?.message) {
                            toast.error(result.message);
                        }
                        else if (result?.message) {
                            toast.success(result.message);
                        }
                        formRef.current?.reset();
                    }
                }>
                <input name="user_uid" type="text" defaultValue={user?.user_uid || session.user.user_uid} hidden formNoValidate />
                <label htmlFor="email">Email: </label>
                <input name="email" type="email" placeholder="Enter your email" defaultValue={searchParams.get("email")?.toString() || session.user.email} onBlur={handleEmailChange} onChange={useDebouncedCallback(handleEmailChange, 3000)} required formNoValidate />
                <label htmlFor="role">Role: </label>
                <select name="role" defaultValue="user" required>
                    {["user", "admin"].map((role) => {
                        return <option key={role} value={role}>{role}</option>
                    })}
                </select>
                <SubmitButton buttonClass="btn-ok w-40 mr-4 mt-4" buttonTitle="Update" onButtonClick={handleUpdateClick} submitingButtonTitle="Updating" />
                <button type="button" className="btn-cancel w-40 mr-4 mt-4" onClick={() => formRef.current?.reset()}>Reset</button>
            </form>
        </>
    );
};