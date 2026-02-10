import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDailySales } from "../api/sales";

export function useSaveDailySales(date) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveDailySales,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (newSale) => {
      await queryClient.cancelQueries(["daily-report", date]);

      const previous = queryClient.getQueryData([
        "daily-report",
        date,
      ]);

      queryClient.setQueryData(
        ["daily-report", date],
        (old) => ({
          ...old,
          sales: newSale.cashAmount + newSale.onlineAmount,
          netBalance:
            newSale.cashAmount +
            newSale.onlineAmount -
            old.purchases -
            old.otherExpenses,
        })
      );

      return { previous };
    },

    onError: (_err, _newSale, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["daily-report", date],
          context.previous
        );
      }
    },

    onSuccess: () => {
      // invalidate monthly report (profit changes)
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
    },
  });
}
