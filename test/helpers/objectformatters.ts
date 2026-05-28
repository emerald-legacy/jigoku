import util from 'util';

import BaseCard from '../../server/game/basecard.js';
import Game from '../../server/game/game.js';
import Player from '../../server/game/player.js';

function formatObject(keys: string[]): (this: Record<string, unknown>) => string {
    return function() {
        const formattedProperties: string[] = [];
        for(const key of keys) {
            const value = this[key];
            formattedProperties.push(`key:${util.inspect(value)}`);
        }
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

BaseCard.prototype.toString = formatObject(['name', 'location']);
Player.prototype.toString = formatObject(['name']);

Game.prototype.toString = function(): string {
    return 'Game';
};
