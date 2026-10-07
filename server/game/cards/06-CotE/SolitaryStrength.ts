import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class SolitaryStrength extends DrawCard {
    static id = 'solitary-strength';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => {
                    if(context.source.parentCharacter && context.source.parentCharacter.isParticipating()) {
                        let participantsForController = (this.game.currentConflict && this.game.currentConflict.getNumberOfParticipantsFor(context.player)) ?? 0;
                        const parentOwnedByController = context.source.parentCharacter.controller === context.player;
                        if(parentOwnedByController) {
                            participantsForController = Math.max(0, participantsForController - 1);
                        }
                        return participantsForController > 0;
                    }
                    return false;
                },
                message: '{0} is discarded from play as {1} is not participating alone in the conflict',
                messageArgs: (context) => [context.source, context.source.parentCharacter],
                gameAction: discardFromPlay()
            })
        });

        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller
            })
            .gainHonor();
    }
}


export default SolitaryStrength;
