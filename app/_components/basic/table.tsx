"use client"

import TableBody from "@/app/_components/basic/table_body";
import TableHead from "@/app/_components/basic/table_head";
import { useState } from "react";

type TableProps = {

};

export default function Table({  }: TableProps) {

    const columns = [
        { key: 'id', label: 'id', sortable: false },
        { key: 'c2', label: 'c2', sortable: true},
    ];

    const data = [
        { 'id': '2', 'c2': '2' },
        { 'id': '1', 'c2': '1' },
    ];

    const [tableData, setTableData] = useState(data);

    const handleSorting = (sortField: string, sortOrder: "asc"|"desc") => {
        if (sortField in data[0]) {
            const sorted = data.sort((a, b) => {
                return (
                    a[sortField as keyof typeof data[0]].toString()
                        .localeCompare(b[sortField as keyof typeof data[0]].toString(), 
                        "en", { numeric: true }) * (sortOrder === "asc" ? 1 : -1)
                );
            });
            setTableData(sorted);
        }
    };

    return (
        <table>
            <TableHead columns={columns} handleSorting={handleSorting} />
            <TableBody data={tableData} primaryKey="id" />
        </table>
    );
};