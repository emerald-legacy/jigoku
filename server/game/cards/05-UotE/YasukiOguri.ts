import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.player === context.player.opponent && event.card.type === CardType.Event && context.source.isDefending()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default YasukiOguri;
