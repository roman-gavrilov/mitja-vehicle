import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getESTTimestamp } from '@/app/utils/dateUtils';

export async function POST(request) {
  const { source, errorData } = await request.json();
  
  const timestamp = getESTTimestamp();
  const logEntry = `[${timestamp} EST] ${source}:\n${JSON.stringify(errorData, null, 2)}\n\n`;
  
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'error.log');

  // Ensure the log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  // Append the log entry to the file
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to error log:', err);
    }
  });

  // Also log to console
  console.error('Server received client error:', logEntry);

  return NextResponse.json({ status: 'Error logged' });
}