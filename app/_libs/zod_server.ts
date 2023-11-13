import { z } from 'zod';

export const createShipdocSchema = z.object({
    shipdoc_uid: z.string().min(1).uuid(),
    shipdoc_number: z.string().min(1),
    shipdoc_contact: z.string().min(1),
    shipdoc_createdAt: z.coerce.date(),
    shipdoc_updatedAt: z.coerce.date(),
});

export type TReadShipdocSchema = z.infer<typeof readShipdocSchema>;

export const readShipdocSchema = createShipdocSchema.partial();

export const updateShipdocSchema = createShipdocSchema.pick({
    shipdoc_uid: true,
    shipdoc_contact: true,
    shipdoc_updatedAt: true,
});

export const deleteShipdocSchema = createShipdocSchema.pick({
    shipdoc_uid: true,
});



export const createLotSchema = z.object({
    lot_uid: z.string().min(1).uuid(),
    tray_uid: z.string().min(1).uuid(),
    lot_id: z.string().length(10, {message: "Please enter a valid lot!"}),
    lot_qty: z.coerce.number().int().min(1),
    lot_createdAt: z.coerce.date(),
    lot_updatedAt: z.coerce.date(),
});

export type TReadLotSchema = z.infer<typeof readLotSchema>;

export const readLotSchema = createLotSchema.partial();

export const updateLotSchema = createLotSchema.omit({
    lot_uid: true,
    lot_qty: true,
    lot_updatedAt:true,
});

export const deleteLotSchema = createLotSchema.pick({
    lot_uid: true,
});



export const createBoxSchema = z.object({
    box_uid: z.string().min(1).uuid(),
    box_type_uid: z.string().min(1).uuid(),
    shipdoc_uid: z.string().min(1).uuid(),
    box_status: z.enum(['active', 'shipped']),
    box_createdAt: z.coerce.date(),
    box_updatedAt: z.coerce.date(),
});

export type TReadBoxSchema = z.infer<typeof readBoxSchema>;

export const readBoxSchema = createBoxSchema.extend({
    box_part_number: z.string().length(10, {message: "Please input a valid part number!"}).includes("-", {message: "Please input a valid part number!"}),
}).partial();

export const updateBoxSchema = createBoxSchema.pick({
    box_uid: true,
    box_status: true,
    box_updatedAt: true,
});

export const deleteBoxSchema = createBoxSchema.pick({
    box_uid: true,
});

export const shipBoxSchema = createBoxSchema.pick({
    box_uid: true,
    box_status: true,
    box_updatedAt: true,
});



export const createTraySchema = z.object({
    tray_uid: z.string().min(1).uuid(),
    box_uid: z.string().min(1).uuid(),
    tray_type_uid: z.string().min(1).uuid(),
    tray_createdAt: z.coerce.date(),
    tray_updatedAt: z.coerce.date(),
});

export type TReadTraySchema = z.infer<typeof readTraySchema>;

export const readTraySchema = createTraySchema.partial();

export const updateTraySchema = createTraySchema.pick({
    tray_uid: true,
    box_uid: true,
    tray_type_uid: true,
    tray_updatedAt: true,
});

export const deleteTraySchema = createTraySchema.pick({
    tray_uid: true,
});



export const createTrayTypeSchema = z.object({
    tray_type_uid: z.string().min(1).uuid(),
    tray_part_number: z.string().length(10, {message: "Please input a valid part number!"}).includes("-", {message: "Please input a valid part number!"}),
    tray_max_drive: z.coerce.number().int().min(1),
    tray_type_createdAt: z.coerce.date(),
    tray_type_updatedAt: z.coerce.date(),
});

export type TReadTrayTypeSchema = z.infer<typeof readTrayTypeSchema>;

export const readTrayTypeSchema = createTrayTypeSchema.partial();

export const updateTrayTypeSchema = createTrayTypeSchema.pick({
    tray_type_uid: true,
    tray_max_drive: true,
    tray_type_updatedAt: true,
});

export const deleteTrayTypeSchema = createTrayTypeSchema.pick({
    tray_type_uid: true,
});



export const createBoxTypeSchema = z.object({
    box_type_uid: z.string().min(1).uuid(),
    box_part_number: z.string().length(10, {message: "Please input a valid part number!"}).includes("-", {message: "Please input a valid part number!"}),
    box_max_tray: z.coerce.number().int().min(1),
    box_type_createdAt: z.coerce.date(),
    box_type_updatedAt: z.coerce.date(),
});

export type TReadBoxTypeSchema = z.infer<typeof readBoxTypeSchema>;

export const readBoxTypeSchema = createBoxTypeSchema.partial();

export const updateBoxTypeSchema = createBoxTypeSchema.pick({
    box_type_uid: true,
    box_max_tray: true,
    box_type_updatedAt: true,
});

export const deleteBoxTypeSchema = createBoxTypeSchema.pick({
    box_type_uid: true,
});