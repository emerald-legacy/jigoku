import EffectSource from '../../server/game/EffectSource.js';
import type { EffectEngine } from '../../server/game/EffectEngine.js';
import { getAbilityDsl, setAbilityDsl, type AbilityDslType } from '../../server/game/AbilityDslProvider.js';
import { createTestGame } from '../helpers/fixtures.js';

describe('EffectSource', function() {
    let effectEngine: EffectEngine;
    let source: EffectSource;
    let fakeDsl: AbilityDslType;
    let originalDsl: AbilityDslType;

    beforeEach(function() {
        const game = createTestGame();
        effectEngine = game.effectEngine;
        spyOn(effectEngine, 'add').and.callFake((effect) => effect);
        source = new EffectSource(game);
        originalDsl = getAbilityDsl();
        // a distinct object, so the spec can tell which DSL the factory received
        fakeDsl = { ...originalDsl };
        setAbilityDsl(fakeDsl);
    });

    afterEach(function() {
        setAbilityDsl(originalDsl);
    });

    describe('untilEndOfConflict()', function() {
        it('should call the property factory with the provided ability DSL', function() {
            const factory = jasmine.createSpy('factory').and.returnValue({});
            source.untilEndOfConflict(factory);
            expect(factory).toHaveBeenCalledWith(fakeDsl);
        });

        it('should add the produced effect to the effect engine', function() {
            const builtEffect = jasmine.createSpy('builtEffect');
            source.untilEndOfConflict(() => ({ effect: builtEffect }));
            expect(effectEngine.add).toHaveBeenCalled();
            expect(builtEffect).toHaveBeenCalled();
        });
    });
});
