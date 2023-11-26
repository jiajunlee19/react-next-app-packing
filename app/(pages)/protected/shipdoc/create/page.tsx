import { createShipdoc } from "@/app/_actions/shipdoc";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Shipdoc',
    description: 'Developed by jiajunlee',
};

export default function CreateShipdoc() {
    
    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Shipdoc", href: "/protected/shipdoc", active: false},
                {label: "Create", href: "/protected/shipdoc/create", active: true}
            ]} />
            <Form 
                formTitle="Create Shipdoc"
                inputType={{
                    'shipdoc_number': 'text',
                    'shipdoc_contact': 'number',
                }}
                rowData={null}
                selectOptionData={null}
                action="create"
                formAction={createShipdoc}
                redirectLink="/protected/shipdoc"
            />
        </>
    );
};