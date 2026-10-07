import { AbilityBuilder, actionProperties, aggregateProperties, createDraft } from '../../../build/server/game/AbilityBuilder.js';
import { bow } from '../../../build/server/game/GameActions/GameActions.js';
import { perRound } from '../../../build/server/game/AbilityLimit.js';

describe('ability builder checks for settings the engine would ignore', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.draft = createDraft('Test', () => true);
            this.builder = new AbilityBuilder(this.draft);
        });

        it('rejects a setting given twice', function() {
            this.builder.condition(() => true).limit(perRound(1));

            expect(() => this.builder.condition(() => false)).toThrowError('Test: condition() is already set');
            expect(() => this.builder.limit(perRound(2))).toThrowError('Test: limit() is already set');
        });

        it('rejects an ability setting or effect() on a then step at the call', function() {
            const step = this.builder.draw().then();

            expect(() => step.limit(perRound(1))).toThrowError('Test: limit() belongs to the ability, before then()');
            expect(() => step.effect('draw')).toThrowError('Test: a then step prints its message with message()');
        });

        it('rejects two targets with one name', function() {
            this.builder.target({ cardType: 'character' });

            expect(() => this.builder.target({ cardType: 'character' })).toThrowError('Test: two targets named target');
        });

        it('rejects onAffinity() when only a target has game actions', function() {
            this.builder.target({ cardType: 'character' }, bow()).onAffinity('air');

            expect(() => actionProperties(this.draft)).toThrowError(/Test: onAffinity\(\) covers the ability's or step's own game actions/);
        });

        it('rejects initiateDuel() with a target', function() {
            this.builder.target({ cardType: 'character' }).initiateDuel(() => ({}));

            expect(() => actionProperties(this.draft)).toThrowError(/Test: initiateDuel\(\) chooses the duel's targets itself/);
        });

        it('rejects anyPlayer() with aggregateWhen', function() {
            this.builder.anyPlayer().draw();

            expect(() => aggregateProperties(this.draft, () => true)).toThrowError('Test: anyPlayer() doesn\'t work with aggregateWhen');
        });
    });
});
