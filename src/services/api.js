import api from "./axios";

export const getDashboardData = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const saveDailySales = async (payload) => {
  const res = await api.post("/sales", payload);
  return res.data;
};

export const getSalesByDate = async (date) => {
  const res = await api.get("/sales", { params: { date } });
  return res.data;
};

export const getSalesHistory = async () => {
  const res = await api.get("/sales/history");
  return res.data;
};

export const savePurchase = async (payload) => {
  const res = await api.post("/purchases", payload);
  return res.data;
};

export const getPurchaseHistory = async () => {
  const res = await api.get("/purchases");
  return res.data;
};

export const addPurchasePayment = async (
    billNumber,
    payload
  ) => {
    const res = await api.patch(
      `/purchases/${billNumber}/pay`,
      payload
    );
    return res.data;
};

export const editPurchase = async (billNumber, payload) => {
  const res = await api.put(
    `/purchases/${billNumber}`,
    payload
  );
  return res.data;
};

export const getFixedExpenses = async (month) => {
  const { data } = await api.get("/fixed-expenses", {
    params: { month },
  });
  return data;
};

export const saveFixedExpenses = async (payload) => {
  const { data } = await api.post("/fixed-expenses", payload);
  return data;
};

export const createExpense = async (payload) => {
  const res = await api.post("/expenses", payload);
  return res.data;
};