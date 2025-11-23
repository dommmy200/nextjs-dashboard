
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  try {
    // Check if env vars exist
    const envCheck = {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      AUTH_URL: !!process.env.AUTH_URL,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
    };

    // Try to connect to database
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({
        status: 'error',
        message: 'POSTGRES_URL not set',
        env: envCheck,
      }, { status: 500 });
    }

    const sql = postgres(process.env.POSTGRES_URL, { 
      connect_timeout: 10,
      ssl: { rejectUnauthorized: false }
    });

    const result = await sql`SELECT NOW() as time, COUNT(*) as total FROM invoices`;
    await sql.end();

    return NextResponse.json({
      status: 'connected',
      timestamp: result[0].time,
      invoiceCount: result[0].total,
      env: envCheck,
      node: process.version,
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      env: {
        POSTGRES_URL: !!process.env.POSTGRES_URL,
        DATABASE_URL: !!process.env.DATABASE_URL,
      }
    }, { status: 500 });
  }
}