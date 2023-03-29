import {apiClient} from "./api";

export const getDashboard = async () => {
    const response = await apiClient.get('/src/assets/data.json');
    return response.data
}