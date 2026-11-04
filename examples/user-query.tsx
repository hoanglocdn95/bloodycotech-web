"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

type User = {
  id: string;
  name: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.name === "string";
}

export function AppQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export function UserName({ userId }: { userId: string }) {
  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/users/${userId}`, { signal });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const body: unknown = await response.json();
      if (!isUser(body)) {
        throw new Error("Invalid user payload");
      }
      return body;
    },
  });

  if (query.isPending) return <p>Đang tải…</p>;
  if (query.isError) return <p>Không tải được dữ liệu.</p>;
  return <p>{query.data.name}</p>;
}
