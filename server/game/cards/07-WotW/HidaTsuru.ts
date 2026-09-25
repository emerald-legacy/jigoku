import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class HidaTsuru extends DrawCard {
    static id = 'hida-tsuru';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Give this character +1/+1')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());

        this.reaction('Give this character +1/+1')
            .when({
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.card.isParticipating() && context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) }))
            .effect('give him +1{1}/+1{2}', () => ['military', 'political'])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default HidaTsuru;
