import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class ShinjoTrailblazer extends DrawCard {
    static id = 'shinjo-trailblazer';

    setupCardAbilities() {
        this.reaction('Gain +2/+2')
            .when({
                onCardRevealed: (event: EventPayload<EventName.OnCardRevealed>, context) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({ effect: AbilityDsl.effects.modifyBothSkills(2) }))
            .effect('give {0} +2{1}, +2{2}', () => ['military', 'political']);
    }
}


export default ShinjoTrailblazer;
