import fs from 'fs';
import path from 'path';

function getDirectories(srcpath: string): string[] {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

interface CardModule {
    id: string;
    [key: string]: any;
}

export = {
    loadCards: function(basePath: string, directory: string): Record<string, CardModule> {
        const cards: Record<string, CardModule> = {};

        getDirectories(directory).forEach((dir) => {
            const normalisedPath = path.join(directory, dir);

            fs.readdirSync(normalisedPath).forEach((file) => {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const card = require('./cards/' + basePath + '/' + dir + '/' + file);

                cards[card.id] = card;
            });
        });

        return cards;
    }
};
