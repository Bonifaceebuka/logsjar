import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      refetchOnReconnect: true,
      refetchOnWindowFocus: false, // not useful in React Native
    },
    mutations: {
      retry: 1,
    },
  },
});