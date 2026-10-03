import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class UnmatchedExpertise extends DrawCard {
    static id = 'unmatched-expertise';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });
        this.forcedReaction('Removed after attached character loses a conflict')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.loser === context.source.parentCharacter.controller
            })
            .gameAction(AbilityDsl.actions.discardFromPlay());
    }
}


export default UnmatchedExpertise;
