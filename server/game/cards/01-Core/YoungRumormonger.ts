import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class YoungRumormonger extends DrawCard {
    static id = 'young-rumormonger';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: (event) => event.card.type === CardType.Character,
                onCardDishonored: (event) => event.card.type === CardType.Character
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card !== (context as TriggeredAbilityContext<DrawCard>).event.card && card.controller === (context as TriggeredAbilityContext<DrawCard>).event.card?.controller,
                gameAction: AbilityDsl.actions.cancel((context) => ({
                    replacementGameAction:
                        context.event.name === EventName.OnCardHonored
                            ? AbilityDsl.actions.honor()
                            : AbilityDsl.actions.dishonor()
                }))
            }
        });
    }
}


export default YoungRumormonger;
