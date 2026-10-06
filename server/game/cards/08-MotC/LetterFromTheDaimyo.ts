import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { chosenDiscard } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class LetterFromTheDaimyo extends DrawCard {
    static id = 'letter-from-the-daimyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.reaction('Make opponent discard 2 cards')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller &&
                                                   event.conflict.conflictType === ConflictType.Political
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(chosenDiscard({ amount: 2 }));
    }
}


export default LetterFromTheDaimyo;
