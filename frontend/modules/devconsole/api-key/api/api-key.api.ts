import { axios } from "@/common/configs/axios.config";
import { NewApiKeyFormData } from "../dtos/api-key-schema";
import { useMutation } from "@tanstack/react-query";

const createNewApiKey = async (formData: NewApiKeyFormData) => {
  const response = await axios.post("/api-key", formData);
  return response;
};

export const useCreateNewApiKey = () => {
  return useMutation({
    mutationFn: createNewApiKey,
  });
};