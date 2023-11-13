import { createTrayType } from "@/app/_actions/tray_type";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Tray Type',
    description: 'Developed by jiajunlee',
};

export default function CreateTrayType() {
    
    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Tray Type", href: "/tray_type", active: false},
                {label: "Create", href: "/tray_type/create", active: true}
            ]} />
            <Form 
                formTitle="Create Tray Type"
                inputType={{
                    'tray_part_number': 'text',
                    'tray_max_drive': 'number',
                }}
                rowData={null}
                selectOptionData={null}
                action="create"
                formAction={createTrayType}
                redirectLink="/tray_type"
            />
        </>
    );
};