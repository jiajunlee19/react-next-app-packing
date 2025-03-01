import { createLot } from "@/app/_actions/lot";
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";
import Form from "@/app/_components/basic/form";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Lot',
    description: 'Developed by jiajunlee',
};

type CreateLotProps = {
    params: Promise<{
        box_uid: string, 
        tray_uid: string,
    }>,
}

export default async function CreateLot(props: CreateLotProps) {
    const params = await props.params;

    const box_uid = params.box_uid;
    const tray_uid = params.tray_uid;

    return (
        <>  
            <Breadcrumbs breadcrumbs={[
                {label: 'Box', href: '/authenticated/box', active: false},
                {label: `Box: ${box_uid}`, href: `/authenticated/box/${box_uid}/tray`, active: false},
                {label: `Tray: ${tray_uid}`, href: `/authenticated/box/${box_uid}/tray/${tray_uid}/lot`, active: false},
                {label: "Create Lot", href: `/authenticated/box/${box_uid}/tray/${tray_uid}/lot/create`, active: true}
            ]} />
            <Form 
                formTitle="Create Lot"
                inputType={{
                    'tray_uid': 'hidden',
                    'lot_id': 'text',
                    'lot_qty': 'number',
                }}
                rowData={{'tray_uid': tray_uid}}
                selectOptionData={null}
                action="create"
                formAction={createLot}
                redirectLink={`/authenticated/box/${box_uid}/tray/${tray_uid}/lot`}
            />
        </>
    );
};