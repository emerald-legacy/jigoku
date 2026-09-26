import DrawCard from '../../DrawCard.js';
import { EventName, Location, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class KiAlignment extends DrawCard {
    static id = 'ki-alignment';

    setupCardAbilities() {
        this.reaction('Search for kihos')
            .when({
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.conflict.attackingPlayer === context.player && (event.attackers?.some((card) => card.hasTrait('monk')) ?? false),
                onDefendersDeclared: (event: EventPayload<EventName.OnDefendersDeclared>, context) => event.conflict.defendingPlayer === context.player && (event.defenders?.some((card) => card.hasTrait('monk')) ?? false)
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                targetMode: TargetMode.UpTo,
                amount: 8,
                numCards: 2,
                uniqueNames: true,
                cardCondition: (card) => card.hasTrait('kiho'),
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top eight cards of their deck for up to two kihos');
    }
}


export default KiAlignment;
