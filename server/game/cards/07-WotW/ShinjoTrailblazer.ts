import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class ShinjoTrailblazer extends DrawCard {
    static id = 'shinjo-trailblazer';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain +2/+2',
            when: {
                onCardRevealed: (event: EventPayload<EventNames.OnCardRevealed>, context: any) => event.card.isProvince && event.card.controller === context.player.opponent && this.game.isDuringConflict()
            },
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            effect: 'give {0} +2{1}, +2{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}


export default ShinjoTrailblazer;
