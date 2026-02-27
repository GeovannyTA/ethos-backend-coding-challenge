import pg from 'pg';

export const pool = new pg.Pool({
    user: 'postgres.lnqfxwbolbzstgdvehtn',
    host: 'aws-1-us-east-2.pooler.supabase.com',
    database: 'postgres',
    password: 'Geotre283245', // deje el password hardcodeado para no tener que usar variables de entorno
    port: 6543,
    max: 10,
    idleTimeoutMillis: 30000,
});