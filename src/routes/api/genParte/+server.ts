import { json, type RequestEvent } from '@sveltejs/kit';
import { ExcelTemplate } from 'xlsx-template-next';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { Readable } from 'stream';

// Cache the template file to avoid reading it on every request
const templatePath = path.resolve('static/parte-template.xlsx');
const templateBuffer = fs.readFileSync(templatePath);

let cachedTemplate: ExcelTemplate | null = null;

async function getTemplateInstance() {
     if (!cachedTemplate) {
          cachedTemplate = new ExcelTemplate();
          await cachedTemplate.load(templateBuffer);
     }
     return cachedTemplate; // Reuse the cached instance
}

export async function POST(request: RequestEvent) {
     try {
          console.time('Total Request Time');

          console.time('Parse Request JSON');
          const { Marcadas } = await request.request.json();
          console.timeEnd('Parse Request JSON');

          if (!Marcadas?.length) {
               return json({ error: 'No Marcadas provided for report generation' }, { status: 400 });
          }

          console.time('Calculate Ausentes');
          let Ausentes = 0;
          for (const item of Marcadas) {
               if (item.Estado !== 'Completa') Ausentes++;
          }
          console.timeEnd('Calculate Ausentes');

          console.time('Load & Process Template');
          const template = await getTemplateInstance();
          const processedMarcadas = Marcadas.map(({
               Nombre,
               Estado,
               Entrada,
               Salida
          }: {
               Nombre: string;
               Estado: string;
               Entrada: string;
               Salida: string;
          }) => ({
               Nombre,
               Estado,
               Entrada,
               Salida
          }));

          await template.process(1, {
               Destino: "ARSENAL NAVAL PUERTO BELGRANO",
               Departamento: Marcadas[0].Departamento,
               Marcadas: processedMarcadas, // Use smaller dataset
               fePermanente: Marcadas.length,
               feAusente: Ausentes,
               fePresente: Marcadas.length - Ausentes,
          });
          console.timeEnd('Load & Process Template');

          console.time('Build Excel File');
          const arrayBufferPromise = template.build({ type: 'arraybuffer' });
          const arrayBuffer = await Promise.resolve(arrayBufferPromise);
          if (!(arrayBuffer instanceof ArrayBuffer)) {
               throw new Error('Unexpected type for arrayBuffer');
          }
          const buffer = Buffer.from(arrayBuffer);
          console.timeEnd('Build Excel File');

          console.time('Compress & Send');
          const gzipStream = zlib.createGzip();
          const readableExcelStream = Readable.from([buffer]);
          const compressedStream = readableExcelStream.pipe(gzipStream);
          console.timeEnd('Compress & Send');

          return new Response(compressedStream as any, {
               headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition': 'attachment; filename="report.xlsx.gz"',
                    'Content-Encoding': 'gzip',
               },
          });
     } catch (error) {
          console.error('Error generating report:', error);
          return json({ error: 'Failed to generate report' }, { status: 500 });
     }
}