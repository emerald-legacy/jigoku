import Effect from '../../server/game/Effects/Effect.js';
import { Duration } from '../../server/game/Constants.js';

describe('Effect', function() {
    let game: jasmine.SpyObj<{ getFrameworkContext: (player: unknown) => unknown }>;
    let staticEffect: jasmine.SpyObj<{ setContext: (c: unknown) => void; apply: (t: unknown) => void; unapply: (t: unknown) => void; recalculate: (t: unknown) => boolean }>;
    let frameworkContext: { source?: unknown; ability?: unknown };

    beforeEach(function() {
        frameworkContext = {};
        game = jasmine.createSpyObj('game', ['getFrameworkContext']);
        game.getFrameworkContext.and.returnValue(frameworkContext);
        staticEffect = jasmine.createSpyObj('staticEffect', ['setContext', 'apply', 'unapply', 'recalculate']);
    });

    describe('when the source has no controller (e.g. a framework / ring source)', function() {
        it('should resolve the framework context with null rather than undefined', function() {
            const source = { name: 'framework', facedown: false };
            new Effect(game as never, source as never, {}, staticEffect as never);
            expect(game.getFrameworkContext).toHaveBeenCalledWith(null);
        });
    });

    describe('isEffectActive() for a persistent effect whose source tracks no persistentEffects', function() {
        it('should return false without throwing', function() {
            const source = { name: 'ring', facedown: false };
            const effect = new Effect(game as never, source as never, { duration: Duration.Persistent }, staticEffect as never);
            expect(effect.isEffectActive()).toBe(false);
        });
    });
});
