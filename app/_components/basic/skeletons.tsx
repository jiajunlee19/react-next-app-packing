type TableSkeletonProps = {
    columnCount: string | number,
    rowCount: string | number,
};

export default function TableSkeleton({ columnCount, rowCount }: TableSkeletonProps) {

    const rowSkeleton = <div className="h-6 w-24 rounded-xl bg-gray-100 dark:bg-gray-400/50" />;
    // const actionRowSkeleton = <div className="h-6 w-12 rounded-xl bg-gray-100 dark:bg-gray-400/50" />;

    // rowData length based on columnCount
    const rowData: number[] = Array.from({length: Math.ceil(Number(columnCount))}, (_, i) => i+1);

    // fetchedData length based on rowCount
    const fetchedData: number[][] = Array(Math.ceil(Number(rowCount))).fill(rowData);

    const tableHead =
    <tr>
        {rowData.map(key => {
            return (
                <th className="whitespace-nowrap p-1" key={key}>{rowSkeleton}</th>
            );
        })}
        {/* <th className="whitespace-nowrap p-1">{rowSkeleton}</th> */}
    </tr>;

    const tableBody = fetchedData.map((row, i) => {
        const tableData = row.map((column, i) => {
            return <td className="whitespace-nowrap p-1" key={column+i}>{rowSkeleton}</td>;
        });

        return (
            <tr key={i}>
                {tableData}
                {/* <td className="whitespace-nowrap p-1 flex gap-1 justify-center border-none">
                    {actionRowSkeleton}
                    {actionRowSkeleton}
                </td> */}
            </tr>
        );
    });

    return (
        <table>
            <thead>
                {tableHead}
            </thead>
            <tbody>
                {tableBody}
            </tbody>
        </table>
    );
};