import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from './formatters'

/**
 * exportReportToPDF — builds a clean, branded PDF summary table.
 * @param {{title: string, companyName: string, columns: string[], rows: (string|number)[][]}} report
 */
export function exportReportToPDF(report) {
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.setTextColor(20, 20, 20)
  doc.text(report.companyName || 'Rufino Rent Car', 14, 18)

  doc.setFontSize(11)
  doc.setTextColor(90, 90, 90)
  doc.text(report.title, 14, 25)
  doc.text(`Gerado em ${formatDate(new Date().toISOString())}`, 14, 30)

  autoTable(doc, {
    startY: 36,
    head: [report.columns],
    body: report.rows,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [20, 20, 20], textColor: [201, 169, 97] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  })

  doc.save(`${report.fileName || 'relatorio'}.pdf`)
}

/**
 * exportReportToExcel — builds a .xlsx workbook from tabular data.
 * @param {{title: string, columns: string[], rows: (string|number)[][], fileName: string}} report
 */
export function exportReportToExcel(report) {
  const worksheet = XLSX.utils.aoa_to_sheet([report.columns, ...report.rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, report.title.slice(0, 31))
  XLSX.writeFile(workbook, `${report.fileName || 'relatorio'}.xlsx`)
}

export function buildVehicleProfitabilityReport(vehicles, rentals, expenses, vehicleProfileFn) {
  const rows = vehicles.map((v) => {
    const profile = vehicleProfileFn(v, rentals, expenses)
    return [
      `${v.brand} ${v.model}`,
      v.plate,
      formatCurrency(profile.totalRevenue),
      formatCurrency(profile.totalExpenses),
      formatCurrency(profile.netProfit),
      `${profile.roi.toFixed(1)}%`,
      profile.rentalCount,
    ]
  })
  return {
    title: 'Relatório de Lucratividade por Veículo',
    fileName: 'lucratividade-por-veiculo',
    columns: ['Veículo', 'Placa', 'Receita', 'Despesa', 'Lucro líquido', 'ROI', 'Locações'],
    rows,
  }
}
