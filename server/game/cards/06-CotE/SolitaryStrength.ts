import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SolitaryStrength extends DrawCard {
    static id = 'solitary-strength';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: any) => {
                    if(context.source.parent && context.source.parent.isParticipating()) {
                        let participantsForController = (this.game.currentConflict && this.game.currentConflict.getNumberOfParticipantsFor(context.player)) ?? 0;
                        let parentOwnedByController = context.source.parent.controller === context.player;
                        if(parentOwnedByController) {
                            participantsForController = Math.max(0, participantsForController - 1);
                        }
                        return participantsForController > 0;
                    }
                    return false;
                },
                message: '{0} is discarded from play as {1} is not participating alone in the conflict',
                messageArgs: (context: any) => [context.source, context.source.parent],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event: any, context: any) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}


export default SolitaryStrength;
