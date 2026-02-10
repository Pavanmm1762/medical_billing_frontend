import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "../services/api";

export function useDashboardData() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
    staleTime: 60 * 1000,          // 1 minute cache
    refetchOnWindowFocus: false,   // Mobile friendly
    retry: 1,
  });

  return {
    daily: data?.daily ?? {
      sales: 0,
      purchases: 0,
      otherExpenses: 0,
      netBalance: 0,
    },

    monthly: data?.monthly ?? {
      totalSales: 0,
      totalPurchases: 0,
      otherExpenses: 0,
      fixedExpenses: 0,
      netProfit: 0,
    },

    isLoading,
    error: isError ? error : null,
    refetch,
  };
}
