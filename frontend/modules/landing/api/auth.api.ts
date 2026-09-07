import { axios } from "@/common/configs/axios.config";
import { useMutation } from "@tanstack/react-query";

const userGoogleLogin = async (token: string) => {
  const response = await axios.post("/auth/socials/google", {
    token,
  });

  return response;
};

export const useUserGoogleLogin = () => {
  return useMutation({
    mutationFn: userGoogleLogin,
  });
};