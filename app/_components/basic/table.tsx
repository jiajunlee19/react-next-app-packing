"use client"

import { useReactTable, ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, getFilteredRowModel, ColumnOrderState, Header, Table, Column } from "@tanstack/react-table";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useMemo, FC } from "react";
import { TRowData } from "@/app/_libs/types";

type TableProps = {
    columns: ColumnDef<TRowData, any>[]
    data: TRowData[],
};

export default function Table({ columns, data }: TableProps) {

    const memoColumns = useMemo(() => columns, [columns]);
    const memoData = useMemo(() => data, [data]);

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(memoColumns.map(column => column.id as string));

    const resetOrder = () => {
        setColumnOrder(memoColumns.map(column => column.id as string));
    };

    const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
        columnOrder.splice(
            columnOrder.indexOf(targetColumnId), 
            0, 
            columnOrder.splice(
                columnOrder.indexOf(draggedColumnId), 
                1
            )[0]
        );
        return [...columnOrder]
    };

    const DraggableColumnHeader: FC<{
        header: Header<TRowData, unknown>
        table: Table<TRowData>
    }> = ( {header, table} ) => {
        const { getState, setColumnOrder } = table;
        const { columnOrder } = getState();
        const { column } = header;
        const [, dropRef] = useDrop({
            accept: 'column',
            drop: (draggedColumn: Column<TRowData>) => {
                const newColumnOrder = reorderColumn(
                    draggedColumn.id,
                    column.id,
                    columnOrder,
                );
                setColumnOrder(newColumnOrder);
            }
        });
        const [{ isDragging }, dragRef, previewRef] = useDrag({
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
            item: () => column,
            type: 'column',
        });

        return (
            <th onClick={header.column.getToggleSortingHandler()} ref={dropRef} colSpan={header.colSpan} style={{opacity: isDragging ? 0.5 : 1}}>
                <div ref={previewRef}>
                    {header.isPlaceholder ? null : 
                        <>
                            {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                            )}
                            {
                                {asc: '🔽', desc: '🔼'} [header.column.getIsSorted() as string] ?? null
                            }
                        </>
                    }
                    <button className="mx-2 px-1 py-0" ref={dragRef}>🟰</button>
                </div>
            </th>
        );
    };

    const table = useReactTable({
        data: memoData, 
        columns: memoColumns, 
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        // getPaginationRowModel: getPaginationRowModel(),
        manualSorting: false,
        getSortedRowModel: getSortedRowModel(),
        manualFiltering: true,
        // getFilteredRowModel: getFilteredRowModel(),
        // initialState: {
        //     pagination: {
        //         pageSize: 10,
        //         pageIndex: 0,
        //     },
        // },
        state: {
            sorting: sorting,
            // globalFilter: filtering,
            columnOrder: columnOrder,
        },
        onSortingChange: setSorting,
        // onGlobalFilterChange: setFiltering,
        onColumnOrderChange: setColumnOrder,
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <DraggableColumnHeader key={header.id} header={header} table={table} />
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                {/* <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot> */}
            </table>
            {/* <div className="inline-flex">
                <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={() => table.setPageIndex(0)}>First Page</button>
                    <button className="btn btn-primary" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous Page</button>
                    <button className="btn btn-primary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next Page</button>
                    <button className="btn btn-primary" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>Last Page</button>
                    <button className="btn btn-primary" onClick={resetOrder}>Reset Order</button>
                </div>
            </div> */}
        </DndProvider>
    );
};