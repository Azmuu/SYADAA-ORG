import * as XLSX from "xlsx";
/**
 * Download rows as an .xlsx file. Each object becomes a row; keys are column headers.
 * @param {Record<string, string|number|boolean|null|undefined>[]} rows
 * @param {{ fileName?: string; sheetName?: string }} [opts]
 */
export function exportToExcel(rows, opts = {}) {
  const { fileName = "export", sheetName = "Data" } = opts;
  if (!rows?.length) {
    if (typeof window !== "undefined") window.alert("Nothing to export.");
    return;
  }
  const safeSheet = String(sheetName)
    .replace(/[\\/*?:\[\]]/g, "")
    .trim()
    .slice(0, 31) || "Data";
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, safeSheet);
  const safeFile = String(fileName)
    .replace(/[\\/:*?"<>|]+/g, "-")
    .trim()
    .slice(0, 200) || "export";
  const d = new Date();
  const ts = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  XLSX.writeFile(wb, `${safeFile}_${ts}.xlsx`);
}
