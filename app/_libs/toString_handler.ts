// getString with unknown type

export const getString = (d: string | number | Date | undefined) => {
    if (d instanceof Date) {
        // if it is a Date object, convert it to dateString
        const dateStringList = new Date((d as Date).getTime() - ((d as Date).getTimezoneOffset() * 60000 ))
                            .toISOString()
                            .split("T");
        const dateString = dateStringList[0];
        const timeString = dateStringList[1].split(".")[0];
        return (dateString + " " + timeString);
    }
    else if (typeof d === "undefined") {
        return ""
    }
    else {
        return d.toString();
    }
};