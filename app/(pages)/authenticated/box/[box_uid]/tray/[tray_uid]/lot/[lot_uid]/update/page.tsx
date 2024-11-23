import { readLotById, updateLot } from "@/app/_actions/lot";
import Form from "@/app/_components/basic/form";
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'
import Breadcrumbs from "@/app/_components/basic/breadcrumbs";

export const metadata: Metadata = {
    title: 'Update Lot',
    description: 'Developed by jiajunlee',
};

type UpdateLotProps = {
    params: Promise<{
        box_uid: string, 
        tray_uid: string, 
        lot_uid: string,
    }>,
}

export default async function UpdateLot(props : UpdateLotProps) {
    const params = await props.params;

    const {box_uid, tray_uid, lot_uid} = params;

    let lot;
    try {
        [lot] = await Promise.all([
            readLotById(lot_uid)
        ]);
    } catch (err) {
        lot = null; 
    }

    if (!lot) {
        notFound();
    }

    return (
        <>
            <Breadcrumbs breadcrumbs={[
                {label: 'Box', href: '/box', active: false},
                {label: `Box: ${box_uid}`, href: `/box/${box_uid}/tray`, active: false},
                {label: `Tray: ${tray_uid}`, href: `/box/${box_uid}/tray/${tray_uid}/lot`, active: false},
                {label: `Lot: ${lot_uid}`, href: `/box/${box_uid}/tray/${tray_uid}/lot/${lot_uid}/update`, active: true}
            ]} />
            <Form 
                formTitle="Update Lot"
                inputType={{
                    'lot_uid': 'hidden',
                    'lot_id': 'readonly',
                    'lot_qty': 'number',
                }}
                rowData={lot}
                selectOptionData={null}
                action="update"
                formAction={updateLot}
                redirectLink={`/box/${box_uid}/tray/${tray_uid}/lot`}
            />
        </>
    );
};