import { NextResponse } from 'next/server';
import pool from '@/lib/db'; 

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ 
      success: true, 
      message: "Database connected successfully! 🎉",
      time: result.rows[0].now 
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Database connection failed!",
      error: error.message 
    }, { status: 500 });
  }
}