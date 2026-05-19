import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class HidaSukune extends DrawCard {
    static id = 'hida-sukune';

    setupCardAbilities() {
        this.action({
            title: 'Draw and discard a card',
            condition: context => context.source.isDefending(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: 1
                })),
                AbilityDsl.actions.chosenDiscard(context => ({
                    target: context.player,
                    amount: 1
                }))
            ]),
            limit: AbilityDsl.limit.perConflict(1)
        });
    }
}


export default HidaSukune;

