/*eslint no-console:0 */
import axios from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToJSON = path.join(__dirname, '../test/json/Card');

const [, , env] = process.argv;
if(env !== 'beta' && env !== 'prod') {
    console.error('You must specify the environment to fetch data from. The options are `beta` or `prod`.');
    process.exit(1);
}

const host = env === 'beta' ? 'https://beta-emeralddb.herokuapp.com/api/' : 'https://www.emeralddb.org/api/';

function apiRequest(path) {
    return axios.get(host + path).then((res) => res.data);
}

apiRequest('cards')
    .then(async (cards) => {
        console.log(cards.length + ' cards fetched');
        await fs.mkdir(pathToJSON, { recursive: true });
        return Promise.all(
            cards.map((card) => fs.writeFile(path.join(pathToJSON, `${card.id}.json`), JSON.stringify([card])))
        );
    })
    .then(() => console.log('fetched successfully'))
    .catch(() => console.log('error fetching'));
