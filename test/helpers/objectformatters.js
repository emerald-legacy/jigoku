/* eslint camelcase: 0, no-invalid-this: 0 */

import util from 'util';

import BaseCard from '../../build/server/game/basecard.js';
import Game from '../../build/server/game/game.js';
import Player from '../../build/server/game/player.js';

// Add custom toString methods for better Jasmine output
function formatObject(keys) {
    return function () {
        const formattedProperties = [];
        for(const key of keys) {
            const value = this[key];
            formattedProperties.push(`key:${util.inspect(value)}`);
        }
        return this.constructor.name + '({ ' + formattedProperties.join(', ') + ' })';
    };
}

BaseCard.prototype.toString = formatObject(['name', 'location']);
Player.prototype.toString = formatObject(['name']);

Game.prototype.toString = function () {
    return 'Game';
};
