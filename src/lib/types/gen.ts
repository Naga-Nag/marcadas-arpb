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

export type WebUser = {
    id: number;
    username: string;
    password: string;
    token: string; //JWT
    role: string;
    departamento: string;
    departamentosPermitidos: string[];
}

export type shortWebUser = {
    ipaddr: string;
    username: string;
    role: string;
    departamento: string;
    departamentosPermitidos: string[];
}

export type Notification = {
    id: number;
    title: string;
    message: string;
    duration: number;
    type: string;
};
