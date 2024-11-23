import { createBox } from "@/app/_actions/box";
import { readBoxType } from "@/app/_actions/box_type";
import { readShipdoc } from "@/app/_actions/shipdoc";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Box',
    description: 'Developed by jiajunlee',
};

export default async function CreateBox() {
    
    const [boxType, shipdoc] = await Promise.all([
        readBoxType(),
        readShipdoc(),
    ]);

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Box", href: "/box", active: false},
                {label: "Create", href: "/box/create", active: true}
            ]} />
            <Form 
                formTitle="Create Box"
                inputType={{
                    'box_part_number': 'select',
                    'shipdoc_number': 'select',
                }}
                rowData={null}
                selectOptionData={[...boxType, ...shipdoc]}
                action="create"
                formAction={createBox}
                redirectLink="/box"
            />
        </>
    );
};