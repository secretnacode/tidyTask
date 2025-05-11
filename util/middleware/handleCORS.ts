import { NextRequest, NextResponse } from "next/server";

export function handleCORS(request: NextRequest) {
  const response = NextResponse.next();

  // setting which url can access the API routes,
  // as of now its only set to "*" which means all url is allowed to access the API routes
  // so in production or when deployed, this should be set to the url of the frontend app lik "TaskTidy.com"
  response.headers.set("Access-Control-Allow-Origin", "*");

  // setting which methods are allowed to access the API routes
  // as of now its only set to "GET, POST, PUT, DELETE, OPTIONS" which means all methods are allowed to access the API routes
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  // setting which headers are allowed to access the API routes
  // as of now its only set to "Content-Type, Authorization" which means all headers are allowed to access the API routes
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // setting which credentials are allowed to access the API routes
  // as of now its only set to "true" which means all credentials are allowed to access the API routes
  response.headers.set("Access-Control-Allow-Credentials", "true");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}
