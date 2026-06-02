import { CardType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MasterOfBindings extends DrawCard {
    static id = 'master-of-bindings';

    public setupCardAbilities() {
        this.reaction({
            title: 'Bow a character that just readied',
            when: {
                onCardReadied: ({ card }, context) =>
                    card.type === CardType.Character &&
                    card.controller === context.player.opponent &&
                    ((card as DrawCard).printedCost ?? 0) <= 3
            },
            gameAction: AbilityDsl.actions.bow((context) => ({ target: (context as TriggeredAbilityContext).event.card }))
        });
    }
}
