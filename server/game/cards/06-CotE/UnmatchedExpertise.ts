import { cannotReceiveDishonorToken } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class UnmatchedExpertise extends DrawCard {
    static id = 'unmatched-expertise';

    setupCardAbilities() {
        this.whileAttached({
            effect: cannotReceiveDishonorToken()
        });
        this.forcedReaction('Removed after attached character loses a conflict')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.loser === context.source.parentCharacter.controller
            })
            .discardFromPlay();
    }
}


export default UnmatchedExpertise;
