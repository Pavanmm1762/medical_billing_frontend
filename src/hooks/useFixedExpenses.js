import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFixedExpenses,
  saveFixedExpenses,
} from "../services/api";

/**
 * Hook to fetch & update fixed expenses (month-wise)
 * @param {string} month - YYYY-MM
 */
export function useFixedExpenses(month) {
  const queryClient = useQueryClient();

  /* 🔹 Fetch fixed expenses for month */
  const query = useQuery({
    queryKey: ["fixed-expenses", month],
    queryFn: () => getFixedExpenses(month),
    enabled: !!month,
    staleTime: 5 * 60 * 1000, // cache for 5 min
    retry: false,
  });

  /* 🔹 Save / Update (Upsert) */
  const mutation = useMutation({
    mutationFn: saveFixedExpenses,

    onSuccess: () => {
      // Refresh everything affected by fixed expenses
      queryClient.invalidateQueries({ queryKey: ["fixed-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    save: mutation, // expose mutation as save
  };
}
