import { type TRowData, type StatePromise } from "@/app/_libs/types";
import { getString } from "@/app/_libs/toString_handler";
import UpdateButton from "@/app/_components/basic/button_update";
import DeleteButton from "@/app/_components/basic/button_delete";

type DataTableProps = {
    itemsPerPage: number,
    currentPage: number,
    query?: string,
    id?: string,
    readAction: (itemsPerPage: number, currentPage: number, query?: string, id?: string) => Promise<TRowData[]>
    columnListDisplay: string[],
    primaryKey: string,
    hrefUpdate?: string,
    deleteAction?: (deleteId: string) => StatePromise, 
};

export default async function DataTable( { itemsPerPage, currentPage, query, id, readAction, columnListDisplay, primaryKey, hrefUpdate, deleteAction }: DataTableProps ) {
    
    let fetchedData: TRowData[];
    if (!id) {
        fetchedData = await readAction(itemsPerPage, currentPage, query);
    }
    else {
        fetchedData = await readAction(itemsPerPage, currentPage, query, id);
    }

    // Filter columns based on columnList provided
    const filteredData = fetchedData.map((row) => {
        return Object.fromEntries(Object.entries(row).filter( ([key,val]) => columnListDisplay.includes(key)));
    });
    

    //taking 1st fetched data row key to generate table headers
    const tableHead =
        <tr>
            {Object.keys(filteredData[0] || {}).map(key => {
                return (
                    <th key={key}>{key}</th>      
                );
            })}
            {(!!hrefUpdate || !!deleteAction) &&
                <th>action</th>
            }
        </tr>;


    //taking fetched data rows as table body
    const tableBody = filteredData.map((row, i) => {
        const tableData = Object.keys(row).map(column => {
            return  <td key={column}>{getString(row[column])}</td>;
        });
        
        return (
            //use each table row UID as key value 
            <tr key={fetchedData[i][primaryKey].toString()}>
                {tableData}
                
                {(!!hrefUpdate || !!deleteAction) &&
                <td className="flex gap-1 justify-center align-middle">
                    {!!hrefUpdate && <UpdateButton href={hrefUpdate.replace("[placeholder-id]", fetchedData[i][primaryKey].toString())} />}
                    {!!deleteAction && <DeleteButton deleteId={fetchedData[i][primaryKey].toString()} deleteAction={deleteAction} />}
                </td>
                }
            </tr>
        );

    });

    return (
        <>
            <table>
                <thead>
                    {tableHead}
                </thead>
                <tbody>
                    {tableBody}
                </tbody>
            </table>
        </>
    );
};