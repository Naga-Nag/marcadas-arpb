export type Marcada = {
    UID: string;
    MR: string;
    Nombre: string;
    Departamento: string;

    Marcada: string;
    Entrada: string;
    Salida: string;
    Estado: string;
    
    CUIL: string;
    Jornada: string;
    Activo: string;
};

export type Usuario = {
    UID: string;
    MR: string;
    Nombre: string;
    Departamento: string;
    CUIL: string;
    Jornada: string;
    Activo: string;
    Foto: string;
};

export type Notification = {
    id: number;
    title: string;
    message: string;
    duration: number;
    type: string;
};