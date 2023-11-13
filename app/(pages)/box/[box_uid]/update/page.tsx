import { readBoxById, updateBox } from "@/app/_actions/box";
import Form from "@/app/_components/basic/form";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";

export const metadata: Metadata = {
    title: 'Update Box',
    description: 'Developed by jiajunlee',
};

export default async function UpdateBox({params}: {params: {box_uid: string}}) {
    
    const box_uid = params.box_uid;

    let box;
    try {
        [box] = await Promise.all([
            readBoxById(box_uid)
        ]);
    } catch (err) {
        box = null; 
    }

    if (!box) {
        notFound();
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Box", href: "/box", active: false},
                {label: `Update ${box_uid}`, href: `/box/${box_uid}/update`, active: true}
            ]} />
            <Form 
                formTitle="Update Box"
                inputType={{
                    'box_uid': 'hidden',
                    'box_type_uid': 'text',
                    'shipdoc_uid': 'text',
                    'box_status': 'text',
                }}
                rowData={box}
                selectOptionData={null}
                action="update"
                formAction={updateBox}
                redirectLink="/box"
            />
        </>
    );
};