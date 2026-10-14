import { AbilityBuilder, toActionProps, createDraft } from '../../../build/server/game/AbilityBuilder.js';
import { gainFate, gainHonor } from '../../../build/server/game/GameActions/GameActions.js';

describe('select() in the ability builder', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.context = this.game.getFrameworkContext(this.player1.player);
            this.draft = createDraft('Test', () => true);
            this.builder = new AbilityBuilder(this.draft);
            this.choose = (label) => {
                this.context.selects = { target: { choice: label } };
                return toActionProps(this.draft).chatText(this.context);
            };
        });

        it('takes the choices alone, as the select named target', function() {
            this.builder.select({ 'Gain 1 honor': gainHonor(), 'Gain 1 fate': gainFate() });

            const properties = toActionProps(this.draft);
            expect(Object.keys(properties.target.choices)).toEqual(['Gain 1 honor', 'Gain 1 fate']);
        });

        it('uses the chosen choice\'s chatText for the ability\'s line', function() {
            this.builder.select({
                'Gain 1 honor': { action: gainHonor(), chatText: 'gain 1 honor' },
                'Gain 1 fate': { action: gainFate(), chatText: () => ['gain {0} fate', [1]] }
            });

            expect(this.choose('Gain 1 honor')).toEqual(['gain 1 honor', [this.context.chatTarget()]]);
            expect(this.choose('Gain 1 fate')).toEqual(['gain {0} fate', [1]]);
        });

        it('leaves a choice without chatText to its game action\'s text', function() {
            this.builder.select({
                'Gain 1 honor': { action: gainHonor(), chatText: 'gain 1 honor' },
                'Gain 1 fate': gainFate()
            });

            expect(this.choose('Gain 1 fate')).toBeUndefined();
        });

        it('rejects chatText() next to chatText choices', function() {
            this.builder.select({ 'Gain 1 honor': { action: gainHonor(), chatText: 'gain 1 honor' } }).chatText('gain honor');

            expect(() => toActionProps(this.draft)).toThrowError('Test: chatText() and a select\'s chatText choices both say what the ability does');
        });
    });
});
