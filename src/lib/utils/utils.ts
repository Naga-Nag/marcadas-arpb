// Removed the inline module declaration as it will be moved to a separate declaration file.

import * as XLSX from 'xlsx';
import type { Marcada } from '../types/gen';
import { getAusentes, globalStore } from '$lib/stores/global';

let marcadasIntermedias: boolean;

globalStore.subscribe((value) => {
  marcadasIntermedias = value.marcadasIntermedias;
});

export function downloadExcel(data: Array<Marcada>, fileName = 'marcada') {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No hay datos para exportar a Excel");
    return;
  }

  // Create a worksheet with the desired column arrangement
  const worksheet = XLSX.utils.json_to_sheet(data.map((row) => ({
    'M.R': row.MR,
    'CUIL': row.CUIL,
    'Nombre': row.Nombre,
    'CAUSA': '',
    'COD AUS': '',
    'Horas': '',
    'Observaciones': '',
    ...(marcadasIntermedias ? {
      'Marcada': row.Marcada || '',
    } : {
      'Entrada': row.Entrada,
      'Salida': row.Salida,
    }),
  })));
  // Create a header range and set the font to bold
  const headerRange = XLSX.utils.decode_range("A1:H1");
  for (let R = headerRange.s.r; R <= headerRange.e.r; ++R) {
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
      if (cell) {
        cell.s = { font: { bold: true } };
      }
    }
  }

  // Create a workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

  // Create an Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a blob for downloading
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);

  // Create a link and simulate a click to download the file
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.xlsx`;
  link.click();

  // Release the object URL
  window.URL.revokeObjectURL(url);
}

export function formatIP(ip: string) {
  ip = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  return ip;
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

export function parseCustomDate(dateString: string) {
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
  const estadoOrder = ['Sin datos', 'Falta salida', 'Falta entrada', 'Completa'];
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

export function sortNumber(a: number, b: number, sortOrder: 'asc' | 'desc' | undefined) {
  if (sortOrder === 'asc') {
    return a - b;
  } else {
    return b - a;
  }
}

export function sortString(a: string, b: string, sortOrder: 'asc' | 'desc' | undefined) {
  if (sortOrder === 'asc') {
    return a.localeCompare(b);
  } else {
    return b.localeCompare(a);
  }
}


export function getEstado(marcada: { Entrada: any; Salida: any; Marcada?: any; }) {
  if (marcada.Entrada && marcada.Salida) {
    return 'Completa';
  } else if (marcada.Entrada && !marcada.Salida) {
    return 'Falta salida';
  } else if (!marcada.Entrada && marcada.Salida) {
    return 'Falta entrada';
  } else if (!marcada.Marcada) {
    return 'Sin datos';
  } else {
    return 'Sin datos';
  }

}

export function filtrarMarcadasFinde(marcadas: Marcada[]): Marcada[] {
  marcadas.map((marcada) => {
    let dateMarcada = new Date(marcada.Marcada);

    if ([6, 0].includes(dateMarcada.getDay())) {
      marcadas.splice(marcadas.indexOf(marcada), 1);
      console.log('Eliminado: ', dateMarcada);
    }
  })

  return marcadas
}

export function reemplazarMarcadas(registros: Marcada[], newItem: Marcada) {
  return registros.map((item) =>
    item.UID === newItem.UID ? { ...item, ...newItem } : item
  );
}