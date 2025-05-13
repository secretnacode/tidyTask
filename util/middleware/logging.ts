import { NextRequest } from "next/server";

export function LogRequest(req: NextRequest): void {
  console.log(`Request URL: ${req.url}`);
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Body: ${req.body}`);
}
