import {  useQuery } from "@tanstack/react-query";
import { axios } from "@/common/configs/axios.config";

export const getLogs = async () => {
  const { data } = await axios.get(`/logs`);
  return data?.data;
};

export const useGetLogs = () => {
  return useQuery({
    queryKey: ["getLogs"],
    queryFn: getLogs,
  });
};