import EffectSource from '../../server/game/EffectSource.js';
import type { EffectEngine } from '../../server/game/EffectEngine.js';
import { createTestGame } from '../helpers/fixtures.js';

describe('EffectSource', function() {
    let effectEngine: EffectEngine;
    let source: EffectSource;

    beforeEach(function() {
        const game = createTestGame();
        effectEngine = game.effectEngine;
        spyOn(effectEngine, 'add').and.callFake((effect) => effect);
        source = new EffectSource(game);
    });

    describe('untilEndOfConflict()', function() {
        it('should add the effect to the effect engine', function() {
            const builtEffect = jasmine.createSpy('builtEffect');
            source.untilEndOfConflict({ effect: builtEffect });
            expect(effectEngine.add).toHaveBeenCalled();
            expect(builtEffect).toHaveBeenCalled();
        });
    });
});
