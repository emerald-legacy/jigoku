import https from 'https';
import http from 'http';

type ExpressHandler = (req: unknown, res: unknown, next: (err?: unknown) => void) => unknown;

export function escapeRegex(regex: string): string {
    return regex.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

export function httpRequest(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const request = lib.get(url, (response) => {
            const status = response.statusCode ?? 0;
            if(status < 200 || status > 299) {
                return reject(new Error('Failed to request, status code: ' + status));
            }

            const body: Buffer[] = [];

            response.on('data', (chunk: Buffer) => {
                body.push(chunk);
            });

            response.on('end', () => {
                resolve(body.join(''));
            });
        });

        request.on('error', (err) => reject(err));
    });
}

export function wrapAsync(fn: (...args: Parameters<ExpressHandler>) => Promise<unknown>): ExpressHandler {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

export function detectBinary(
    state: unknown,
    path = '',
    results: Array<{ path: string; type: string }> = []
): Array<{ path: string; type: string }> {
    if(!state) {
        return results;
    }

    const type = (state as { constructor: { name: string } }).constructor.name;
    if(
        type !== 'Array' &&
        type !== 'Boolean' &&
        type !== 'Date' &&
        type !== 'Number' &&
        type !== 'Object' &&
        type !== 'String'
    ) {
        results.push({ path: path, type });
    }

    if(type === 'Object') {
        const obj = state as Record<string, unknown>;
        for(let key in obj) {
            detectBinary(obj[key], `${path}.${key}`, results);
        }
    } else if(type === 'Array') {
        const arr = state as unknown[];
        for(let i = 0; i < arr.length; ++i) {
            detectBinary(arr[i], `${path}[${i}]`, results);
        }
    }

    return results;
}
