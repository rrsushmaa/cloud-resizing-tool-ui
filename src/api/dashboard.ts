import {apiClient} from "./api";

export const getDashboard = async () => {
    const response = await apiClient.get('/src/assets/data.json');
    // await sleep()
    return response.data
}

export const sleep = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 2000)
    })
}