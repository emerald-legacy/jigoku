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
        it('should use a framework context of the player who created it', function() {
            const creator = testPlayer(game, 'player2');
            const source = new EffectSource(game, 'framework');
            new ActiveEffect(game, source, { controller: creator }, staticEffect);
            expect(game.getFrameworkContext).toHaveBeenCalledWith(creator);
        });

        it('should refuse an effect without a creating player', function() {
            const source = new EffectSource(game, 'framework');
            expect(() => new ActiveEffect(game, source, {}, staticEffect)).toThrowError(/has no controller/);
        });
    });

    describe('isEffectActive() for a persistent effect whose source tracks no persistentEffects', function() {
        it('should return false without throwing', function() {
            const source = new EffectSource(game, 'ring');
            const effect = new ActiveEffect(game, source, { duration: Duration.Persistent, controller: testPlayer(game) }, staticEffect);
            expect(effect.isEffectActive()).toBe(false);
        });
    });
});
