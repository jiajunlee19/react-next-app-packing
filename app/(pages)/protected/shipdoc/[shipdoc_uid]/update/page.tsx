import { readShipdocById, updateShipdoc } from "@/app/_actions/shipdoc";
import Form from "@/app/_components/basic/form";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";

export const metadata: Metadata = {
    title: 'Update Shipdoc',
    description: 'Developed by jiajunlee',
};

export default async function UpdateShipdoc({params}: {params: {shipdoc_uid: string}}) {
    
    const shipdoc_uid = params.shipdoc_uid;

    let shipdoc;
    try {
        [shipdoc] = await Promise.all([
            readShipdocById(shipdoc_uid)
        ]);
    } catch (err) {
        shipdoc = null; 
    }

    if (!shipdoc) {
        notFound();
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Shipdoc", href: "/protected/shipdoc", active: false},
                {label: `Update ${shipdoc_uid}`, href: `/protected/shipdoc/${shipdoc_uid}/update`, active: true}
            ]} />
            <Form 
                formTitle="Update Shipdoc"
                inputType={{
                    'shipdoc_uid': 'hidden',
                    'shipdoc_number': 'readonly',
                    'shipdoc_contact': 'text',
                }}
                rowData={shipdoc}
                selectOptionData={null}
                action="update"
                formAction={updateShipdoc}
                redirectLink="/protected/shipdoc"
            />
        </>
    );
};