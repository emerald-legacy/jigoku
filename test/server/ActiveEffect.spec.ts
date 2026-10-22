import { ActiveEffect } from '../../server/game/Effects/ActiveEffect.js';
import { EffectSource } from '../../server/game/EffectSource.js';
import { StaticEffect } from '../../server/game/Effects/StaticEffect.js';
import { Duration, EffectName } from '../../server/game/Constants.js';
import type Game from '../../server/game/Game.js';
import { createTestGame, testPlayer } from '../helpers/fixtures.js';

describe('ActiveEffect', function() {
    let game: Game;
    let staticEffect: StaticEffect<EffectName.ModifyMilitarySkill>;

    beforeEach(function() {
        game = createTestGame();
        spyOn(game, 'getFrameworkContext').and.callThrough();
        staticEffect = new StaticEffect(EffectName.ModifyMilitarySkill, 1);
    });

    describe('when the source has no controller (e.g. a framework / ring source)', function() {
        it('should use a framework context of the first player', function() {
            const first = testPlayer(game);
            spyOn(game, 'getPlayersInFirstPlayerOrder').and.returnValue([first]);
            const source = new EffectSource(game, 'framework');
            new ActiveEffect(game, source, {}, staticEffect);
            expect(game.getFrameworkContext).toHaveBeenCalledWith(first);
        });
    });

    describe('isEffectActive() for a persistent effect whose source tracks no persistentEffects', function() {
        it('should return false without throwing', function() {
            const source = new EffectSource(game, 'ring');
            const effect = new ActiveEffect(game, source, { duration: Duration.Persistent }, staticEffect);
            expect(effect.isEffectActive()).toBe(false);
        });
    });
});
