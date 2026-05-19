import { lstatSync, readdirSync } from 'node:fs';
import { join, sep } from 'node:path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function allJsFiles(dir: string): string[] {
    const files: string[] = [];

    for(const file of readdirSync(dir)) {
        if(file.startsWith('_')) {
            continue;
        }

        const filepath = join(dir, file);
        if(lstatSync(filepath).isDirectory()) {
            files.push(...allJsFiles(filepath));
        } else if(file.endsWith('.js') && !dir.endsWith(`${sep}cards`)) {
            files.push(filepath);
        }
    }
    return files;
}

const cardsMap = new Map<string, unknown>();
for(const filepath of allJsFiles(__dirname)) {
    const fileImported = require(filepath);
    const card = 'default' in fileImported ? fileImported.default : fileImported;
    if(!card.id) {
        throw Error('Importing card class without id!');
    }
    if(cardsMap.has(card.id)) {
        throw Error(`Importing card class with repeated id!: ${card.id}`);
    }
    cardsMap.set(card.id, card);
}

export const cards = cardsMap;
