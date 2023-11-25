import { getString } from "@/app/_libs/toString_handler";
import { type TRowData } from "@/app/_libs/types";

type TableBodyProps = {
    data: TRowData[],
    primaryKey: string,
};

export default function TableBody({ data, primaryKey }: TableBodyProps) {

    const tableBody = data.map((row, i) => {

        const tableData = Object.keys(row).map((column) => {
            return  <td key={column}>{getString(row[column])}</td>;
        });

        return (
            <tr key={data[i][primaryKey].toString()}>
                {tableData}
            </tr>
        );
    });

    return (
        <tbody>
            {tableBody}
        </tbody>
    );
};