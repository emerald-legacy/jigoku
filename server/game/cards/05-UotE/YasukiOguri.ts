import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.player === context.player.opponent && event.card.type === CardType.Event && context.source.isDefending()
            })
            .gameAction(ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(ability.limit.unlimitedPerConflict());
    }
}


export default YasukiOguri;
