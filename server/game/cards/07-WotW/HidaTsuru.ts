import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class HidaTsuru extends DrawCard {
    static id = 'hida-tsuru';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Give this character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });

        this.reaction({
            title: 'Give this character +1/+1',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event: EventPayload<EventName.OnCardPlayed>, context) => event.card.isParticipating() && context.source.isParticipating()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}


export default HidaTsuru;
