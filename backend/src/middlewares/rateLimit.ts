import { Request, Response, NextFunction } from 'express';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Lightweight in-process limiter for development/single-instance deployments.
// For multi-instance production, replace this with a shared Redis-backed limiter.
export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (current.count >= options.max) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader('Retry-After', retryAfter.toString());
      res.status(429).json({
        success: false,
        message: options.message ?? 'Demasiadas solicitudes. Intenta nuevamente más tarde.',
      });
      return;
    }

    current.count += 1;
    next();
  };
}

// Avoid unbounded memory growth in long-running development processes.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref();
