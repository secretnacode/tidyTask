import { NextRequest } from "next/server";
import { LogRequest } from "./util/middleware/logging";
import { handleCORS } from "./util/middleware/handleCORS";

export default async function Middleware(req: NextRequest) {
  // logging the requeset
  LogRequest(req);

  // handling CORS
  const res = handleCORS(req);

  return res; // returning the next response
}

export const config = {
  matcher: [
    "/api/:path*", // Matches all routes under /api/
  ],
};
