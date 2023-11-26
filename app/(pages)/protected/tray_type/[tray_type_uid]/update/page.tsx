import { readTrayTypeById, updateTrayType } from "@/app/_actions/tray_type";
import Form from "@/app/_components/basic/form";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";

export const metadata: Metadata = {
    title: 'Update Tray Type',
    description: 'Developed by jiajunlee',
};

export default async function UpdateTrayType({params}: {params: {tray_type_uid: string}}) {
    
    const tray_type_uid = params.tray_type_uid;

    let tray_type;
    try {
        [tray_type] = await Promise.all([
            readTrayTypeById(tray_type_uid)
        ]);
    } catch (err) {
        tray_type = null; 
    }

    if (!tray_type) {
        notFound();
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: "Tray Type", href: "/protected/tray_type", active: false},
                {label: `Update ${tray_type_uid}`, href: `/protected/tray_type/${tray_type_uid}/update`, active: true}
            ]} />
            <Form 
                formTitle="Update Tray Type"
                inputType={{
                    'tray_type_uid': 'hidden',
                    'tray_part_number': 'readonly',
                    'tray_max_drive': 'number',
                }}
                rowData={tray_type}
                selectOptionData={null}
                action="update"
                formAction={updateTrayType}
                redirectLink="/protected/tray_type"
            />
        </>
    );
};