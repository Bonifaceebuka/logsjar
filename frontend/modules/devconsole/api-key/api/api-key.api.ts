import { axios } from "@/common/configs/axios.config";
import { NewApiKeyFormData } from "../dtos/api-key-schema";
import { useMutation, useQuery } from "@tanstack/react-query";

const createNewApiKey = async (formData: NewApiKeyFormData) => {
  const response = await axios.post("/api-key", formData);
  return response;
};

export const useCreateNewApiKey = () => {
  return useMutation({
    mutationFn: createNewApiKey,
  });
};


const fetchApiKeys = async () => {
  const response = await axios.get("/api-key");
  return response?.data;
};

export const useFetchApiKeys = () => {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: () => fetchApiKeys(),
  });
};