import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class LetterFromTheDaimyo extends DrawCard {
    static id = 'letter-from-the-daimyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.reaction({
            title: 'Make opponent discard 2 cards',
            cost: AbilityDsl.costs.sacrificeSelf(),
            when: {
                afterConflict: (event, context) => context.source.attachedCharacter && context.source.attachedCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.attachedCharacter.controller &&
                                                   event.conflict.conflictType === 'political'
            },
            gameAction: AbilityDsl.actions.chosenDiscard({ amount: 2 })
        });
    }
}


export default LetterFromTheDaimyo;
