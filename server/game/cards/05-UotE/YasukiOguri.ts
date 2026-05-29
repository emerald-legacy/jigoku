import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event: EventPayload<EventNames.OnCardPlayed>, context: any) => event.player === context.player.opponent && event.card.type === CardTypes.Event && context.source.isDefending()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}


export default YasukiOguri;
