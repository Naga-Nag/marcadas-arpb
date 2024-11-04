export type Marcada = {
    MR: number;
    Nombre: string;
    Departamento: string;
    Entrada: string;
    Salida: string;
    Estado: string;
};

export interface Data {
    records: any[];
    departamentos: { DeptName: string }[];
    hostname: string;
}


