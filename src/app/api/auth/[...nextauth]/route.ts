import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Not found. This route has been replaced by Firebase Auth.' }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ error: 'Not found. This route has been replaced by Firebase Auth.' }, { status: 404 });
}
