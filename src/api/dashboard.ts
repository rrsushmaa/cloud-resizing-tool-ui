import { apiClient } from "./api";

const token = import.meta.env.process.env.TW_CR_TOKEN;

export const getDashboardApi = async () => {
  const response = await apiClient.get(
    "http://20.198.88.89:8080/suggestions1",
    {
      headers: {
        token,
      },
    }
  );
  return response.data;
};

export const postResizeApi = async (resourceName: string) => {
  const response = await apiClient.post(
    `http://20.198.88.89:8080/resize?name=${resourceName}`,
    {
      headers: {
        token,
      },
    }
  );
  return response.data;
};
