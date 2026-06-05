import { CardType, EventName, Location, Players } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class GoldenPlains extends ProvinceCard {
    static id = 'golden-plains';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard, context) => card.controller === context?.player && card.location === Location.PlayArea,
            targetController: Players.Self,
            effect: AbilityDsl.effects.addTrait('cavalry'),
            condition: (context: AbilityContext) => context.player.stronghold?.name === 'Golden Plains Outpost'
        });

        this.reaction({
            title: 'Move the conflict',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}
