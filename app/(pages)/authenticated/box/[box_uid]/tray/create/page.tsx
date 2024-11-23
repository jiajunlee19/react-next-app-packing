import { createTray } from "@/app/_actions/tray";
import { readTrayType } from "@/app/_actions/tray_type";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Tray',
    description: 'Developed by jiajunlee',
};

export default async function CreateTray({ params }: { params: { box_uid: string } }) {
    
    const box_uid = params.box_uid;

    const [trayType] = await Promise.all([
        readTrayType(),
    ]);

    return (
        <>  
            <Breadcrumbs breadcrumbs={[
                {label: 'Box', href: '/box', active: false},
                {label: `Box: ${box_uid}`, href: `/box/${box_uid}/tray`, active: false},
                {label: "Create Tray", href: `/box/${box_uid}/tray/create`, active: true}
            ]} />
            <Form 
                formTitle="Create Tray"
                inputType={{
                    'box_uid': 'hidden',
                    'tray_part_number': 'select',
                }}
                rowData={{'box_uid': box_uid}}
                selectOptionData={[...trayType]}
                action="create"
                formAction={createTray}
                redirectLink={`/box/${box_uid}/tray`}
            />
        </>
    );
};