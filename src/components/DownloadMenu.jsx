import { downloadPdf, downloadExcel } from "../services/reports";

export default function DownloadMenu({ month }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => downloadPdf(month)}
        className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
      >
        PDF
      </button>

      <button
        onClick={() => downloadExcel(month)}
        className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
      >
        Excel
      </button>
    </div>
  );
}
