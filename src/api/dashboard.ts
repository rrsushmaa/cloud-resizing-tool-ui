import { apiClient } from "./api";

const token = import.meta.env.VITE_TW_CR_TOKEN;
const baseUrl = "http://20.235.126.73:8080";

export const getDashboardApi = async () => {
  const response = await apiClient.get(
    `${baseUrl}/suggestions1`,
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
    `${baseUrl}/resize?name=${resourceName}`,
    {},
    {
      headers: {
        token,
      },
    }
  );
  return response.data;
};
