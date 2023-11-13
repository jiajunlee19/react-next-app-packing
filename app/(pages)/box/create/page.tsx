import { createBox } from "@/app/_actions/box";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Box',
    description: 'Developed by jiajunlee',
};

export default function CreateBox() {
    
    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Box", href: "/box", active: false},
                {label: "Create", href: "/box/create", active: true}
            ]} />
            <Form 
                formTitle="Create Box"
                inputType={{
                    'box_type_uid': 'text',
                    'shipdoc_uid': 'text',
                    'box_status': 'text',
                }}
                rowData={null}
                selectOptionData={null}
                action="create"
                formAction={createBox}
                redirectLink="/box"
            />
        </>
    );
};