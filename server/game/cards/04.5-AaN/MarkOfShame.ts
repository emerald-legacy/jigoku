import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { dishonor, sequential } from '../../GameActions/GameActions.js';

class MarkOfShame extends DrawCard {
    static id = 'mark-of-shame';

    setupCardAbilities() {
        this.reaction('Dishonor attached character')
            .when({
                onCardPlayed: (event, context) => event.card === context.source
            })
            .gameAction(sequential([
                dishonor((context) => ({ target: context.source.parentCharacter ?? [] })),
                dishonor((context) => ({ target: context.source.parentCharacter ?? [] }))
            ]))
            .chatText((context) => msg`dishonor ${context.source.parentCharacter}, then dishonor it again`);
    }
}


export default MarkOfShame;
