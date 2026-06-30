// "use client";
// import { useEffect, useMemo, useState, useCallback } from "react";
// import { apiFetch } from "@/config/api";

// type ApiState<T> = {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   refetch: () => Promise<void>;
// };

// export function useApi<T>(endpoint: string | null, init?: RequestInit): ApiState<T> {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState(Boolean(endpoint));
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     if (!endpoint) {
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await apiFetch<T>(endpoint, init);
//       setData(result);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   }, [endpoint, init]);

//   useEffect(() => {
//     void fetchData();
//   }, [fetchData]);

//   return { data, loading, error, refetch: fetchData };
// }
