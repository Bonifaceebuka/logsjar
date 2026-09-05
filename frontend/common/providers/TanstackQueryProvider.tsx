'use client'

import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "@/common/configs/tanstack-config";
import { PropsWithChildren } from "react";
import { useState } from 'react'
import { QueryClient } from '@tanstack/react-query'

export default function TanstackQueryProvider({
  children,
}: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}