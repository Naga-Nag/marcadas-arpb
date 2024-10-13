import os from 'os';
export function downloadCSV(data: Array<any>) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("No hay datos para exportar a CSV");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [headers.join(",")].concat(
    data.map(item => {
      return headers.map(key => {
        const value = item[key];
        if (typeof value === "object") {
          if (Array.isArray(value)) {
            return value.map(nestedItem => JSON.stringify(nestedItem)).join(",");
          } else {
            return JSON.stringify(value);
          }
        }
        return value;
      }).join(",");
    })
  ).join("\n");

  const blob = new Blob([csvContent], { type: 'application/excel;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href
    = url;
  link.download = 'marcada.xls';
  link.click();
}

export function getDepartamentoHost() {
  if (Bun.env.build === 'dev') {
    return 'TAAP';
  } else {
    const hostname = os.hostname();
    return hostname.substring(0, 4);
  }
}