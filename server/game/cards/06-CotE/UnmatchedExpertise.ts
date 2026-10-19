import { cannotReceiveDishonorToken } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

class UnmatchedExpertise extends DrawCard {
    static id = 'unmatched-expertise';

    override setupCardAbilities() {
        this.whileAttached({
            effect: cannotReceiveDishonorToken()
        });
        this.forcedReaction('Removed after attached character loses a conflict')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnLosingSide(context.source.parentCharacter)
            })
            .discardFromPlay();
    }
}


export default UnmatchedExpertise;
