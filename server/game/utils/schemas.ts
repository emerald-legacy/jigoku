import { z } from 'zod';

/** An array whose invalid entries are dropped instead of failing the whole array. */
export function lenientArray<Item>(entry: z.ZodType<Item>) {
    return z.array(z.unknown()).transform((entries) => entries.flatMap((value) => {
        const parsed = entry.safeParse(value);
        return parsed.success ? [parsed.data] : [];
    }));
}

/** A record whose invalid entries are dropped instead of failing the whole record. */
export function lenientRecord<Item>(entry: z.ZodType<Item>) {
    return z.record(z.string(), z.unknown()).transform((entries) => {
        const valid: Record<string, Item> = {};
        for(const [key, value] of Object.entries(entries)) {
            const parsed = entry.safeParse(value);
            if(parsed.success) {
                valid[key] = parsed.data;
            }
        }
        return valid;
    });
}
