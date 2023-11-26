import { readBoxTypeById, updateBoxType } from "@/app/_actions/box_type";
import Form from "@/app/_components/basic/form";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";

export const metadata: Metadata = {
    title: 'Update Box Type',
    description: 'Developed by jiajunlee',
};

export default async function UpdateBoxType({params}: {params: {box_type_uid: string}}) {
    
    const box_type_uid = params.box_type_uid;

    let box_type;
    try {
        [box_type] = await Promise.all([
            readBoxTypeById(box_type_uid)
        ]);
    } catch (err) {
        box_type = null; 
    }

    if (!box_type) {
        notFound();
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Box Type", href: "/protected/box_type", active: false},
                {label: `Update ${box_type_uid}`, href: `/protected/box_type/${box_type_uid}/update`, active: true}
            ]} />
            <Form 
                formTitle="Update Box Type"
                inputType={{
                    'box_type_uid': 'hidden',
                    'box_part_number': 'readonly',
                    'box_max_tray': 'number',
                }}
                rowData={box_type}
                selectOptionData={null}
                action="update"
                formAction={updateBoxType}
                redirectLink="/protected/box_type"
            />
        </>
    );
};