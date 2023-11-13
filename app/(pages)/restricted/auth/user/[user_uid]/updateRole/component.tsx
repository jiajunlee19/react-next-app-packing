"use client"

import { updateRole } from "@/app/_actions/auth";
import { useRef } from "react";
import { notFound } from 'next/navigation';
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import { TReadUserWithoutPassSchema } from "@/app/_libs/zod_auth";
import FormWithoutState from "@/app/_components/basic/form_without_state";

type TUpdateRoleComponentProps = {
    user: TReadUserWithoutPassSchema | null,
};

export default function UpdateRoleComponent({ user }: TUpdateRoleComponentProps) {

    if (!user) {
        notFound();
    }

    const formRef = useRef<HTMLFormElement>(null);

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
            <Breadcrumbs breadcrumbs={[
                {label: "User", href: "/restricted/auth/user", active: false},
                {label: `Update ${user.user_uid}`, href: `/restricted/auth/user/${user.user_uid}/updateRole`, active: true}
            ]} />

            <FormWithoutState 
                formTitle="Update Role"
                inputType={{
                    'user_uid': 'hidden',
                    'email': 'readonly',
                    'role': 'select',
                }}
                rowData={user}
                selectOptionData={[{'role': 'user'}, {'role': 'admin'}, {'role': 'boss'}]}
                action="update"
                formAction={updateRole}
                redirectLink="/restricted/auth/user"
            />
        </>
    );
};