
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    env: {
      AUTH_URL: !!process.env.AUTH_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    },
    node: process.version,
  });
}