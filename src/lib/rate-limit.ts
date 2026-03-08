/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP with a sliding window.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipMap) {
    if (now > entry.resetTime) {
      ipMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a request is rate limited.
 * @param ip - Client IP address
 * @param maxAttempts - Max requests allowed in the window (default: 5)
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns true if the request should be blocked
 */
export function isRateLimited(
  ip: string,
  maxAttempts = 5,
  windowMs = 60 * 1000
): boolean {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetTime) {
    ipMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxAttempts;
}

/**
 * Extract client IP from Next.js request.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || 'unknown';
}
