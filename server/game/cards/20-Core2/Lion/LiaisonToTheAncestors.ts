import { CardType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class LiaisonToTheAncestors extends DrawCard {
    static id = 'liaison-to-the-ancestors';

    setupCardAbilities() {
        this.reaction({
            title: 'Protect the honor of a character',
            when: {
                onCardDishonored: (event: { card: DrawCard }, context) =>
                    event.card.type === CardType.Character &&
          event.card.controller === context.player &&
          (context.player.dynastyDiscardPile as Array<DrawCard>).some(
              (card) => (event.card.printedCost ?? 0) < (card.printedCost ?? 0)
          )
            },
            gameAction: AbilityDsl.actions.honor((context: AbilityContext) => ({
                target: (context as TriggeredAbilityContext).event.card
            }))
        });
    }
}
