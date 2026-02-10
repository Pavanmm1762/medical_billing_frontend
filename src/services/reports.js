import api from "./axios";

export const getDailyReport = async (date) => {
  const res = await api.get("/reports/daily", {
    params: { date },
  });
  return res.data;
};

export const getMonthlyReport = async (month) => {
  const res = await api.get("/reports/monthly", {
    params: { month },
  });
  return res.data;
};

export const downloadPdf = (month) => {
  window.open(
    `http://localhost:8080/api/reports/monthly/pdf?month=${month}`,
    "_blank"
  );
};

export const downloadExcel = (month) => {
  window.open(
    `http://localhost:8080/api/reports/monthly/excel?month=${month}`,
    "_blank"
  );
};