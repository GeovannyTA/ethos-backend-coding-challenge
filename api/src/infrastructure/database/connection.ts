import pg from 'pg';

// Configuración y conexión con la base de datos PostgreSQL (Supabase)
export const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    max: Number(process.env.DB_MAX),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT),
});