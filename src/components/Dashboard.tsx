import {FC, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {getDashboard} from "../api/dashboard";
import {DataGrid, GridColDef, GridRowsProp} from "@mui/x-data-grid";


const columns: GridColDef[] = [
    { field: 'resource', headerName: 'Resource', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'averageCpuUsagePercentage', headerName: 'Average CPU %', width: 150 },
    { field: 'averageMemoryUsagePercentage', headerName: 'Average memory %', width: 150 },
    { field: 'costPerMonth', headerName: 'Cost', width: 150 },
    { field: 'suggestedScheme', headerName: 'Suggestion', width: 150 },
    { field: 'optimize', headerName: 'Optimize', width: 150 },
];
export const Dashboard : FC = () => {
    const { data } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })
    const rows = useMemo(()=> data?.data|| [], [data])
    return (
        <div>

            <div style={{ height: 300, width: '100%' }}>
                <DataGrid rows={rows} columns={columns} />
            </div>
        </div>
    )
}