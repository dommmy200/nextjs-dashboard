// app/api/health/route.ts
import { NextResponse } from 'next/server';
import postgres from 'postgres';

export async function GET() {
  const envCheck = {
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    DATABASE_URL: !!process.env.DATABASE_URL,
    AUTH_URL: !!process.env.AUTH_URL,
    AUTH_SECRET: !!process.env.AUTH_SECRET,
  };

  try {
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'No database URL configured',
        env: envCheck,
      }, { status: 500 });
    }

    const sql = postgres(dbUrl, { 
      connect_timeout: 10,
      ssl: { rejectUnauthorized: false }
    });

    const result = await sql`SELECT NOW() as time, COUNT(*) as invoice_count FROM invoices`;
    const customers = await sql`SELECT COUNT(*) as customer_count FROM customers`;
    
    await sql.end();

    return NextResponse.json({
      status: 'connected ✅',
      timestamp: result[0].time,
      data: {
        invoices: result[0].invoice_count,
        customers: customers[0].customer_count,
      },
      env: envCheck,
      node: process.version,
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error ❌',
      message: error.message,
      code: error.code,
      env: envCheck,
    }, { status: 500 });
  }
}