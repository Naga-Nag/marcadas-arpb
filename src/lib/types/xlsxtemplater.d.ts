declare module '@sailimuhu/xlsxtemplater' {
    export default class XlsxTemplater {
      constructor(templatePath: string);
      render(data: Record<string, any>): Promise<void>;
      save(filePath: string): Promise<void>;
    }
  }