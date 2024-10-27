// This file contains placeholder data that you'll used for dev only, you can seed this into database using "npm run seed"

import { hash } from "bcrypt";

export const users = [
  {
    user_uid: '1493ac72-2669-5f17-a7c2-b78dca0f0344',
    email: 'jiajunlee@email.com',
    password: await hash('12345678', 10),
    role: 'boss',
    user_created_dt: new Date(),
    user_updated_dt: new Date()
  }
]

export const shipdocs = [
  {
    shipdoc_uid: '3e6e459a-f89d-4754-925d-4b90e831ddfc',
    shipdoc_number: '1723456',
    shipdoc_contact: 'JIAJUNLEE',
    shipdoc_created_dt: new Date(),
    shipdoc_updated_dt: new Date()
  }
]

export const box_types = [
  {
    box_type_uid: '4a7e6e73-55f9-4bd8-a73c-f6eebe94fe69',
    box_part_number: '503-500168',
    box_max_tray: 5,
    box_type_created_dt: new Date(),
    box_type_updated_dt: new Date(),
  }
]

export const tray_types = [
  {
    tray_type_uid: '6f760732-bd3e-43a1-a549-7a962d7e54af',
    tray_part_number: '503-500187',
    tray_max_drive: 36,
    tray_type_created_dt: new Date(),
    tray_type_updated_dt: new Date(),
  }
]

export const boxes = [
  {
    box_uid: '192e9679-c737-40ce-a38a-55ed00e80af4',
    box_type_uid: '4a7e6e73-55f9-4bd8-a73c-f6eebe94fe69',
    shipdoc_uid: '3e6e459a-f89d-4754-925d-4b90e831ddfc',
    box_status: 'active',
    box_created_dt: new Date(),
    box_updated_dt: new Date(),
  }
]

export const trays = [
  {
    tray_uid: 'f13f07ae-4880-4994-a9f7-0c527d6e455c',
    box_uid: '192e9679-c737-40ce-a38a-55ed00e80af4',
    tray_type_uid: '6f760732-bd3e-43a1-a549-7a962d7e54af',
    tray_created_dt: new Date(),
    tray_updated_dt: new Date(),
  }
]

export const lots = [
  {
    lot_uid: '493eea20-f424-4a09-9ebc-f1d0a8e37fa7',
    tray_uid: 'f13f07ae-4880-4994-a9f7-0c527d6e455c',
    lot_id: 'JAAABCD001',
    lot_qty: '36',
    lot_created_dt: new Date(),
    lot_updated_dt: new Date(),
  }
]
