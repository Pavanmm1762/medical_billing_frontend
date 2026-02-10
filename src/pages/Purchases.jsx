import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  savePurchase,
  getPurchaseHistory,
  addPurchasePayment,
  editPurchase,
} from "../services/api";

export default function Purchase() {
  const queryClient = useQueryClient();

  /* ---------------------------
     Pagination (ADDED)
  ----------------------------*/
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 5 / 10

  /* ---------------------------
     Reusable form state
  ----------------------------*/
  const [formOpen, setFormOpen] = useState(false);
  const [editBill, setEditBill] = useState(null);

  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [supplier, setSupplier] = useState("");

  /* ---------------------------
     Payment sheet state
  ----------------------------*/
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  /* ---------------------------
     Init form on open
  ----------------------------*/
  useEffect(() => {
    if (!formOpen) return;

    if (editBill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBillNumber(editBill.billNumber);
      setBillDate(editBill.billDate);
      setTotalAmount(editBill.totalAmount);
      setPaidAmount(editBill.paidAmount);
      setSupplier(editBill.supplier || "");
    } else {
      setBillNumber("");
      setBillDate(new Date().toISOString().split("T")[0]);
      setTotalAmount("");
      setPaidAmount("");
      setSupplier("");
    }
  }, [formOpen, editBill]);

  const pending =
    (Number(totalAmount) || 0) - (Number(paidAmount) || 0);

  /* ---------------------------
     Queries
  ----------------------------*/
  const historyQuery = useQuery({
    queryKey: ["purchase-history"],
    queryFn: getPurchaseHistory,
  });

  /* Reset page on data / page size change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [historyQuery.data, pageSize]);

  /* ---------------------------
     Pagination logic
  ----------------------------*/
  const history = historyQuery.data || [];
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedHistory = history.slice(startIndex, endIndex);

  /* ---------------------------
     Mutations
  ----------------------------*/
  const createMutation = useMutation({
    mutationFn: savePurchase,
    onSuccess: () => {
      toast.success("Purchase saved");
      queryClient.invalidateQueries({ queryKey: ["purchase-history"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setFormOpen(false);
    },
    onError: () => toast.error("Failed to save purchase"),
  });

  const editMutation = useMutation({
    mutationFn: ({ billNumber, payload }) =>
      editPurchase(billNumber, payload),
    onSuccess: () => {
      toast.success("Purchase updated");
      queryClient.invalidateQueries({ queryKey: ["purchase-history"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
      setFormOpen(false);
    },
    onError: () => toast.error("Failed to update purchase"),
  });

  const paymentMutation = useMutation({
    mutationFn: ({ billNumber, amount }) =>
      addPurchasePayment(billNumber, {
        additionalPaidAmount: amount,
      }),
    onSuccess: () => {
      toast.success("Payment updated");
      queryClient.invalidateQueries({ queryKey: ["purchase-history"] });
      queryClient.invalidateQueries({ queryKey: ["monthly-report"] });
    },
    onError: () => toast.error("Payment failed"),
  });

  /* ---------------------------
     Render
  ----------------------------*/
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-sm">
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <span className="font-semibold">Purchase History</span>

          <button
            onClick={() => {
              setEditBill(null);
              setFormOpen(true);
            }}
            className="text-blue-600 text-sm font-medium"
          >
            ➕ Add
          </button>
        </div>

        {historyQuery.isLoading && (
          <div className="p-4 text-sm text-gray-500">
            Loading history...
          </div>
        )}

        {paginatedHistory.map((item) => (
          <div
            key={item.billNumber}
            className="px-4 py-3 border-b last:border-none"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.billNumber}</span>
              <span>₹ {item.totalAmount}</span>
            </div>

            <div className="flex justify-between text-xs mt-1">
              <span>Paid: ₹{item.paidAmount}</span>

              {item.pendingAmount === 0 ? (
                <span className="text-green-600 font-semibold">
                  PAID ✅
                </span>
              ) : (
                <span className="text-red-600">
                  Pending: ₹{item.pendingAmount}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
              <span>
                {item.billDate}
                {item.supplier && ` • ${item.supplier}`}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditBill(item);
                    setFormOpen(true);
                  }}
                  className="underline"
                >
                  Edit
                </button>

                {item.pendingAmount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedBill(item);
                      setPayAmount("");
                      setPaymentSheetOpen(true);
                    }}
                    className="text-blue-600 font-medium"
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* PAGINATION FOOTER */}
        {totalItems > 0 && (
          <div className="p-4 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>
                Showing {startIndex + 1}–{endIndex} of {totalItems}
              </span>

              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(Number(e.target.value))
                }
                className="border rounded px-2 py-1 text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.max(p - 1, 1))
                }
                disabled={currentPage === 1}
                className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={currentPage === totalPages}
                className="flex-1 py-2 border rounded-lg text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT SHEET */}
      {formOpen && (
        <BottomSheet onClose={() => setFormOpen(false)}>
          <h2 className="font-semibold text-lg mb-3">
            {editBill ? "Edit Purchase" : "Add Purchase"}
          </h2>

          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();

              if (!billNumber || !totalAmount) {
                toast.error("Bill number & total amount required");
                return;
              }

              const payload = {
                billDate,
                totalAmount: Number(totalAmount),
                paidAmount: Number(paidAmount) || 0,
                supplier,
              };

              if (editBill) {
                editMutation.mutate({
                  billNumber: editBill.billNumber,
                  payload,
                });
              } else {
                createMutation.mutate({
                  billNumber,
                  ...payload,
                });
              }
            }}
          >
            <input
              placeholder="Bill Number"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              disabled={!!editBill}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Total Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              type="number"
              placeholder="Paid Amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <input
              placeholder="Supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border rounded-lg p-2"
            />

            <div className="flex justify-between text-sm pt-2 border-t">
              <span>Pending</span>
              <span className="text-red-600">
                ₹ {pending}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium"
            >
              {editBill ? "Save Changes" : "Save Purchase"}
            </button>
          </form>
        </BottomSheet>
      )}

      {/* PAYMENT SHEET */}
      {paymentSheetOpen && selectedBill && (
        <BottomSheet
          onClose={() => setPaymentSheetOpen(false)}
        >
          <h3 className="font-semibold text-lg">
            Pay Bill – {selectedBill.billNumber}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Pending: ₹ {selectedBill.pendingAmount}
          </p>

          <input
            type="number"
            placeholder="Enter paid amount"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            className="w-full border rounded-lg p-2 mt-4"
          />

          <div className="flex gap-3 mt-4">
            <button
              className="flex-1 bg-green-600 text-white py-2 rounded-xl"
              onClick={() => {
                paymentMutation.mutate({
                  billNumber: selectedBill.billNumber,
                  amount: selectedBill.pendingAmount,
                });
                setPaymentSheetOpen(false);
              }}
            >
              Mark Full Paid
            </button>

            <button
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
              onClick={() => {
                if (!payAmount) {
                  toast.error("Enter amount");
                  return;
                }
                paymentMutation.mutate({
                  billNumber: selectedBill.billNumber,
                  amount: Number(payAmount),
                });
                setPaymentSheetOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

/* ---------------------------
   Bottom Sheet
----------------------------*/
function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto">
        {children}
        <button
          className="w-full mt-4 text-sm text-gray-500"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
