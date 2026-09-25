import { CardType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    setupCardAbilities() {
        this.reaction('Protect the honor of a character')
            .when({
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.type === CardType.Character &&
          event.card.controller === context.player &&
          (context.player.dynastyDiscardPile).some(
              (card) => (event.card.printedCost ?? 0) < (card.printedCost ?? 0)
          )
            })
            .gameAction(AbilityDsl.actions.honor((context) => ({
                target: (context as TriggeredAbilityContext).event.card
            })));
    }
}
