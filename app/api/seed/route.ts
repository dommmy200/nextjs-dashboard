// app/api/seed/route.ts (if you already have app/seed/route.ts, use that)
import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return NextResponse.json({ error: 'POSTGRES_URL not configured' }, { status: 500 });
  }

  const sql = postgres(process.env.POSTGRES_URL, {
    connect_timeout: 15,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check if tables exist
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;

    return NextResponse.json({
      message: 'Database check complete',
      tables: tables.map(t => t.tablename),
      hint: 'If tables are missing, run your seed script'
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      hint: 'Make sure POSTGRES_URL is correct and database is accessible'
    }, { status: 500 });
  } finally {
    await sql.end();
  }
}