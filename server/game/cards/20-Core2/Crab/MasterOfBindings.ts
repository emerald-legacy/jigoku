import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MasterOfBindings extends DrawCard {
    static id = 'master-of-bindings';

    public setupCardAbilities() {
        this.reaction('Bow a character that just readied')
            .when({
                onCardReadied: ({ card }, context) =>
                    card.isCharacter() &&
                    card.controller === context.player.opponent &&
                    (card.printedCost ?? 0) <= 3
            })
            .gameAction(AbilityDsl.actions.bow((context) => ({ target: context.event.card })));
    }
}
