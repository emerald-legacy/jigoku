import { gainAbility } from '../../build/server/game/effects.js';

describe('gainAbility with the builder', function() {
    describe('a gained reaction', function() {
        it('can be built without a play restriction', function() {
            expect(() => gainAbility.reaction('Draw', (ability) => ability.when({ onCardPlayed: () => true }).draw())).not.toThrow();
        });

        it('cannot have a play restriction', function() {
            expect(() => gainAbility.reaction('Draw', (ability) => ability.when({ onCardPlayed: () => true }).playOnlyIf(() => true).draw()))
                .toThrowError('Draw: a gained ability can\'t restrict playing the card');
        });
    });
});
