import { CardTypes, EventNames, Locations, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class GoldenPlains extends ProvinceCard {
    static id = 'golden-plains';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: any, context: any) => card.controller === context?.player && card.location === Locations.PlayArea,
            targetController: Players.Self,
            effect: AbilityDsl.effects.addTrait('cavalry'),
            condition: (context: any) => context.player.stronghold?.name === 'Golden Plains Outpost'
        });

        this.reaction({
            title: 'Move the conflict',
            when: {
                onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>, context: any) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}
