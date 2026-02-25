// Error monitoring - logs errors to console
// Previously used Sentry, now simplified to console logging

export function captureException(exception: any, extra?: Record<string, unknown>): void {
    console.error('Error captured:', exception);
    if(extra) {
        console.error('Extra context:', extra);
    }
}

// No-op middleware for compatibility
export const requestHandler = (_req: any, _res: any, next: () => void) => next();
export const errorHandler = (err: any, _req: any, _res: any, next: (err: any) => void) => next(err);
