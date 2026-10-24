import { Conflict } from '../../../server/game/Conflict.js';
import type Game from '../../../server/game/Game.js';
import type Player from '../../../server/game/Player.js';
import { createTestGame, testPlayer } from '../../helpers/fixtures.js';

describe('A conflict in a solo game', function () {
    let game: Game;
    let attacker: Player;
    let conflict: Conflict;

    beforeEach(function () {
        game = createTestGame();
        attacker = testPlayer(game);
        conflict = new Conflict(game, attacker, undefined);
    });

    it('has no defending player', function () {
        expect(conflict.defendingPlayer).toBeUndefined();
        expect(conflict.getSummary().defendingPlayerId).toBeUndefined();
    });

    it('counts no defender skill and has no defenders', function () {
        conflict.calculateSkill();
        expect(conflict.defenderSkill).toBe(0);
        expect(conflict.getDefenders()).toEqual([]);
        expect(conflict.resolutionBonus(conflict.defendingPlayer)).toBe(0);
    });

    it('resets without a defender', function () {
        expect(() => conflict.resetCards()).not.toThrow();
    });
});
