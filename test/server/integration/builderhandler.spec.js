import { AbilityBuilder, toActionProps, createDraft } from '../../../build/server/game/AbilityBuilder.js';
import { bow } from '../../../build/server/game/GameActions/GameActions.js';

describe('handler() in the ability builder', function() {
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
            this.handler = () => undefined;
        });

        it('rejects what the handler would skip', function() {
            const skips = {
                'game actions': (builder) => builder.draw(1),
                'if()': (builder) => builder.if(() => true).draw(1),
                'onAffinity()': (builder) => builder.onAffinity('air').draw(1),
                'a following step or resolving again': (builder) => builder.then().draw(1)
            };
            for(const [skipped, add] of Object.entries(skips)) {
                const draft = createDraft('Test', () => true);
                add(new AbilityBuilder(draft).handler(this.handler));
                expect(() => toActionProps(draft)).toThrowError(new RegExp(`handler\\(\\) replaces the step's resolution, so .*${skipped.replace(/[()]/g, '\\$&')}.* would never run`));
            }
        });

        it('rejects game actions next to a handler in a then step', function() {
            this.builder.draw(1).then().handler(this.handler).gainHonor(1);

            expect(() => toActionProps(this.draft)).toThrowError('Test: handler() replaces the step\'s resolution, so game actions would never run');
        });

        it('allows target actions, which only decide what can be chosen, and a handler in the next step', function() {
            this.builder.target({ cardType: 'character' }, bow()).handler(this.handler);
            expect(() => toActionProps(this.draft)).not.toThrow();

            const draft = createDraft('Test', () => true);
            new AbilityBuilder(draft).draw(1).then().handler(this.handler);
            expect(() => toActionProps(draft)).not.toThrow();
        });
    });
});
