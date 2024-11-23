import { Database } from "bun:sqlite";

/**
 * Base de datos para estadisticas
 */

const statsdb = new Database("statsdb.sqlite", { create: true, strict: true });
statsdb.exec("PRAGMA journal_mode = WAL;");

/* 
    In WAL mode, writes to the database are written directly to a separate file called the "WAL file" (write-ahead log).
    This file will be later integrated into the main database file.
    Think of it as a buffer for pending writes.
*/