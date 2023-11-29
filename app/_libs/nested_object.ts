import { TRowData } from "@/app/_libs/types";

type NestedObject = {
    [key: string]: NestedObject | TRowData | string | number | Date,
};

// convert nested object
// {
//     box_uid: '192e9679-c737-40ce-a38a-55ed00e80af4',
//     fk_box_type_uid: { box_part_number: '503-500168', box_max_tray: 5 }
// }
// into a flattened object
// {
//     box_uid: '192e9679-c737-40ce-a38a-55ed00e80af4',
//     box_part_number: '503-500168', 
//     box_max_tray: 5
// }
export function flattenNestedObject(obj: NestedObject | TRowData | null) {
    let result: TRowData = {};

    // if obj is null, return it
    if (!obj) {
        return null
    }

    for (const i in obj) {

        // if obj[i] is an object but not an array/Date, do recursive call
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i]) && !(obj[i] instanceof Date)) {
            const temp = flattenNestedObject(obj[i] as TRowData);
            for (const j in temp) {
                result[j] = temp[j];
            }
        }

        // else, assign obj[i] into result 
        else {
            result[i] = (obj[i] as string | number | Date);
        }
    }

    return result
};


// create nested object
// data['product_name']['uom_name'] = '?'
export function createNestedObject( base: NestedObject, names: string[], value: TRowData) {
    // If a value is given, remove the last name and keep it for later:
    let lastName = arguments.length === 3 ? names.pop() : false;

    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for( let i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = (base[ names[i] ] as TRowData) || {};
    }

    // If a value was given, set it to the last name:
    if( lastName ) base = base[ lastName ] = value;

    // Return the last object in the hierarchy:
    return base;

};


// access nested object
// string = data['product_name']['uom_name']
export function accessNestedObject( base: NestedObject, names: string[]) {

    // Walk the hierarchy
    for( let i = 0; i < names.length; i++ ) {
        base = base[ names[i] ] = (base[ names[i] ] as TRowData) || {};
    }

    // Return the last object in the hierarchy:
    return base;

};