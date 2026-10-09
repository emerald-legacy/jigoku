import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { dishonor, returnToHand } from '../../GameActions/GameActions.js';

class CourtMask extends DrawCard {
    static id = 'court-mask';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Return court mask to hand')
            .chatText((context) => msg`return ${context.chatTarget()} to hand, dishonoring ${context.source.parentCharacter ?? ''}`)
            .gameAction(
                returnToHand(),
                dishonor((context) => ({ target: context.source.parentCharacter ?? [] }))
            );
    }
}


export default CourtMask;
