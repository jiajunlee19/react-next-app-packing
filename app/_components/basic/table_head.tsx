import React, { useState } from "react";

type TableHeadProps = {
    columns: {
        key: string,
        label: string,
        sortable: boolean,
    }[],
    handleSorting: (sortField: string, sortOrder: "asc"|"desc") => void
};

export default function TableHead({ columns, handleSorting }: TableHeadProps) {

    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState<"asc"|"desc">("asc");

    const handleSortClick = (key: string) => (e: React.MouseEvent<HTMLTableCellElement>) => {
        if (key === sortField) {
            setOrder(order === "asc" ? "desc" : "asc");
        }
        setSortField(key);
        handleSorting(sortField, order);
    };

    const tableHead =
    <tr>
        {columns.map(column => {
            return (
                <th key={column.key} onClick={column.sortable ? handleSortClick(column.key) : undefined}>
                    {column.label}
                </th>      
            );
        })}
    </tr>;

    return (
        <thead>
            {tableHead}
        </thead>
    );
};