// app/api/db-check/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!dbUrl) {
    return NextResponse.json({ error: 'No database URL' }, { status: 500 });
  }

  const sql = postgres(dbUrl, {
    connect_timeout: 15,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;

    const tableList = tables.map(t => t.tablename);

    // If tables exist, count rows
    let counts: Record<string, number | string> = {};
    if (tableList.length > 0) {
      for (const table of tableList) {
        try {
          const result = await sql.unsafe(`SELECT COUNT(*) as count FROM ${table}`);
          counts[table] = result[0].count;
        } catch (e) {
          counts[table] = 'error';
        }
      }
    }

    await sql.end();

    return NextResponse.json({
      status: tableList.length > 0 ? 'Tables found ✅' : 'No tables ❌',
      tables: tableList,
      rowCounts: counts,
      hint: tableList.length === 0 ? 'Run your seed script to create tables' : 'Database is populated'
    });

  } catch (error: any) {
    await sql.end();
    return NextResponse.json({
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}