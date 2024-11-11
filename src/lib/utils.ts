import os from 'os';
import * as XLSX from 'xlsx';

export function downloadExcel(data: Array<any>, fileName = 'marcada') {
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
  link.download = `${fileName}.xlsx`;
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

export function formatTime(dateString: string): string {
  if (!dateString) return ''; // Handle null or empty case
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function parseCustomDate(dateString: string) {
  if (!dateString) return Number.NEGATIVE_INFINITY; // Handle empty strings or null
  const [day, month, yearAndTime] = dateString.split('/');
  const [year, time] = yearAndTime.split(' ');
  const [hour, minute] = time ? time.split(':') : [0, 0];
  
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute)).getTime();
}

export function sortTime(a: string, b: string, sortOrder: 'asc' | 'desc' | undefined) {
  const isANull = !a;
  const isBNull = !b;

  // Place null or empty values at the end, regardless of sort order
  if (isANull && isBNull) return 0;
  if (isANull) return 1;
  if (isBNull) return -1;

  // Parse and compare non-null dates
  const timeA = parseCustomDate(a);
  const timeB = parseCustomDate(b);

  return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
}

export function sortEstado(a: { Estado: string }, b: { Estado: string }, sortOrder: 'asc' | 'desc' | undefined) {
  const estadoOrder = ['Sin datos', 'Falta entrada', 'Falta salida', 'Completa'];
  if (sortOrder === 'asc') {
    return estadoOrder.indexOf(a.Estado) - estadoOrder.indexOf(b.Estado);
  }
  else if (sortOrder === 'desc') {
    return estadoOrder.indexOf(b.Estado) - estadoOrder.indexOf(a.Estado);
  }
  else {
    return 0;
  }

}

export function sortNumber(a: { MR: number }, b: { MR: number }, sortOrder: 'asc' | 'desc' | undefined) {
  if (sortOrder === 'asc') {
    return a.MR - b.MR;
  } else {
    return b.MR - a.MR;
  }
}

export function sortString(a: string, b: string, sortOrder: 'asc' | 'desc' | undefined) {
  if (sortOrder === 'asc') {
    return a.localeCompare(b);
  } else {
    return b.localeCompare(a);
  }
}


export function getEstado(persona: { Entrada: any; Salida: any }) {
  if (persona.Entrada && persona.Salida) {
    return 'Completa';
  } else if (persona.Entrada && !persona.Salida) {
    return 'Falta salida';
  } else if (!persona.Entrada && persona.Salida) {
    return 'Falta entrada';
  } else {
    return 'Sin datos';
  }
}