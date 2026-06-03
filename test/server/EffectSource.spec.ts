import EffectSource from '../../server/game/EffectSource.js';
import { getAbilityDsl, setAbilityDsl, type AbilityDslType } from '../../server/game/AbilityDslProvider.js';

describe('EffectSource', function() {
    let effectEngine: jasmine.SpyObj<{ add: (effect: unknown) => unknown }>;
    let source: EffectSource;
    let fakeDsl: AbilityDslType;
    let originalDsl: AbilityDslType;

    beforeEach(function() {
        effectEngine = jasmine.createSpyObj('effectEngine', ['add']);
        effectEngine.add.and.callFake((effect: unknown) => effect);
        source = new EffectSource({ effectEngine } as never);
        fakeDsl = { marker: 'fake-dsl' } as never;
        originalDsl = getAbilityDsl();
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
