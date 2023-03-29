import {FC} from "react";
import {useQuery} from "@tanstack/react-query";
import {getDashboard} from "../api/dashboard";

export const Dashboard : FC = () => {
    const { data } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })
    return (
        <div>
            <p>Helloooo</p>
            <p>{JSON.stringify(data)}</p>
        </div>
    )
}