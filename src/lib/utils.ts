import os from 'os';
import * as XLSX from 'xlsx';

export function downloadExcel(data: Array<any>) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No hay datos para exportar a Excel");
    return;
  }

  // Crear una hoja de cálculo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

  // Crear un archivo Excel
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Crear un blob para descargar
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);

  // Crear un enlace y simular un clic para descargar el archivo
  const link = document.createElement('a');
  link.href = url;
  link.download = 'marcada.xls';
  link.click();

  // Liberar el objeto URL
  window.URL.revokeObjectURL(url);
}

export function getDepartamentoHost() {
  if (Bun.env.build === 'dev') {
    return 'PEAP';
  } else {
    const hostname = os.hostname();
    return hostname.substring(0, 4);
  }
}

export function formatTime(dateString: string) {
  if (!dateString) return ''; // Handle null or empty case
  const date = new Date(dateString);
  /* const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString(); */
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  /* return `${day}/${month}/${year} ${hours}:${minutes}`; */
  return `${hours}:${minutes}`
}

export function getEstado(persona: { Entrada: any; Salida: any }) {
  if (persona.Entrada && persona.Salida) {
    return 'Completa';
  } else if (persona.Entrada && !persona.Salida) {
    return 'Falta salida';
  } else if (!persona.Entrada && persona.Salida) {
    return 'Falta entrada';
  } else {
    return 'No marcada';
  }
}