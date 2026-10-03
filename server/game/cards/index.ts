import { readdir, stat } from 'node:fs/promises';
import { join, sep } from 'node:path';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { logger } from '../../logger.js';
import BaseCard from '../BaseCard.js';
import type { CardClass } from '../types/CardClass.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function allJsFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    for(const file of await readdir(dir)) {
        if(file.startsWith('_')) {
            continue;
        }

        const filepath = join(dir, file);
        const stats = await stat(filepath);
        if(stats.isDirectory()) {
            files.push(...await allJsFiles(filepath));
        } else if(file.endsWith('.js') && !dir.endsWith(`${sep}cards`)) {
            files.push(filepath);
        }
    }
    return files;
}

function isCardClass(value: unknown): value is CardClass & { id: string } {
    return typeof value === 'function' && value.prototype instanceof BaseCard && 'id' in value && typeof value.id === 'string' && value.id !== '';
}

async function loadAllCards(): Promise<Map<string, CardClass>> {
    const cardsMap = new Map<string, CardClass>();
    const filepaths = await allJsFiles(__dirname);
    let loaded = 0;
    let skipped = 0;

    for(const filepath of filepaths) {
        try {
            const mod = await import(pathToFileURL(filepath).href);
            const card: unknown = 'default' in mod ? mod.default : mod;
            if(!isCardClass(card)) {
                logger.warn(`Card at ${filepath} has no id, skipping`);
                skipped++;
                continue;
            }
            if(cardsMap.has(card.id)) {
                logger.warn(`Duplicate card id '${card.id}' at ${filepath}, skipping`);
                skipped++;
                continue;
            }
            cardsMap.set(card.id, card);
            loaded++;
        } catch(err) {
            const msg = err instanceof Error ? err.message : String(err);
            logger.error(`Failed to load card ${filepath}: ${msg}`);
            skipped++;
        }
    }

    logger.info(`Card loader: ${loaded} loaded, ${skipped} skipped`);
    return cardsMap;
}

export const cards = await loadAllCards();
