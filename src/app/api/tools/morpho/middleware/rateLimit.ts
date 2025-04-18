import { NextResponse } from 'next/server';
import { ERRORS } from '../utils/errors';

// In-memory store for rate limiting (consider using Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 * @param request - The incoming request
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns NextResponse or undefined
 */
export function rateLimit(
  request: Request,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): NextResponse | undefined {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Get or initialize rate limit data for this IP
  const rateLimitData = rateLimitStore.get(ip) || { count: 0, resetTime: now + windowMs };

  // Reset counter if window has passed
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + windowMs;
  }

  // Increment counter
  rateLimitData.count++;

  // Update store
  rateLimitStore.set(ip, rateLimitData);

  // Check if limit exceeded
  if (rateLimitData.count > limit) {
    return NextResponse.json(
      createErrorResponse(ERRORS.RATE_LIMIT_EXCEEDED),
      { status: 429 }
    );
  }

  return undefined;
}