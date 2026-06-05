import { CardType, EventName } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
export default class MidnightRevels extends ProvinceCard {
    static id = 'midnight-revels';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context: TriggeredAbilityContext) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c: DrawCard) => c.type === CardType.Character);
                    return card.getCost() === Math.max(...charactersInPlay.map((c: DrawCard) => c.getCost()));
                },
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}
