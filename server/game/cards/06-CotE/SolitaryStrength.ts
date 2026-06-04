import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class SolitaryStrength extends DrawCard {
    static id = 'solitary-strength';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: AbilityContext) => {
                    if((context.source as DrawCard).parent && ((context.source as DrawCard).parent as DrawCard).isParticipating()) {
                        let participantsForController = (this.game.currentConflict && this.game.currentConflict.getNumberOfParticipantsFor(context.player)) ?? 0;
                        let parentOwnedByController = ((context.source as DrawCard).parent as DrawCard).controller === context.player;
                        if(parentOwnedByController) {
                            participantsForController = Math.max(0, participantsForController - 1);
                        }
                        return participantsForController > 0;
                    }
                    return false;
                },
                message: '{0} is discarded from play as {1} is not participating alone in the conflict',
                messageArgs: (context: AbilityContext) => [context.source, (context.source as DrawCard).parent],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: any) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}


export default SolitaryStrength;
