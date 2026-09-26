import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import { EventName } from '../../Constants.js';
class SolitaryStrength extends DrawCard {
    static id = 'solitary-strength';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: AbilityContext<this>) => {
                    if(context.source.parentCharacter && context.source.parentCharacter.isParticipating()) {
                        let participantsForController = (this.game.currentConflict && this.game.currentConflict.getNumberOfParticipantsFor(context.player)) ?? 0;
                        let parentOwnedByController = context.source.parentCharacter.controller === context.player;
                        if(parentOwnedByController) {
                            participantsForController = Math.max(0, participantsForController - 1);
                        }
                        return participantsForController > 0;
                    }
                    return false;
                },
                message: '{0} is discarded from play as {1} is not participating alone in the conflict',
                messageArgs: (context: AbilityContext<this>) => [context.source, context.source.parentCharacter],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<DrawCard>) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller
            })
            .gameAction(AbilityDsl.actions.gainHonor());
    }
}


export default SolitaryStrength;
