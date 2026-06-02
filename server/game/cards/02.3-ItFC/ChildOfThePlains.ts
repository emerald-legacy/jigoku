import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class ChildOfThePlains extends DrawCard {
    static id = 'child-of-the-plains';

    setupCardAbilities() {
        this.reaction({
            title: 'Get first action',
            when: {
                onCardRevealed: (event: EventPayload<EventName.OnCardRevealed>, context) =>
                    context.source.isAttacking() && event.card.isConflictProvince() && event.onDeclaration
            },
            effect: 'get the first action in this conflict',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.gainActionPhasePriority()
            }))
        });
    }
}


export default ChildOfThePlains;
