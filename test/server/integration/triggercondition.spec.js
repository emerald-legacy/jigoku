import TriggeredAbility from '../../../build/server/game/TriggeredAbility.js';
import { AbilityType } from '../../../build/server/game/Constants.js';
import { createDraft, toTriggerProps } from '../../../build/server/game/AbilityBuilder.js';

describe('a triggered ability\'s condition', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.when = { onCardHonored: () => true };
        });

        it('stops the ability while it doesn\'t hold', function() {
            const reaction = new TriggeredAbility(this.whisperer, AbilityType.Reaction, { when: this.when, condition: () => false });
            const context = reaction.createContext(this.player1.player);

            expect(reaction.meetsRequirements(context)).toBe('condition');
        });

        it('lets the ability through while it holds', function() {
            const reaction = new TriggeredAbility(this.whisperer, AbilityType.Reaction, { when: this.when, condition: () => true });
            const context = reaction.createContext(this.player1.player);

            expect(reaction.meetsRequirements(context)).not.toBe('condition');
        });

        it('comes from the builder\'s condition()', function() {
            const draft = createDraft('Test', () => true);
            draft.condition = () => false;

            expect(toTriggerProps(draft, this.when).condition).toBe(draft.condition);
        });
    });
});
