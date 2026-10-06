import DrawCard from '../../DrawCard.js';
import { returnToHand } from '../../GameActions/GameActions.js';

class SharpenedTsuruhashi extends DrawCard {
    static id = 'sharpened-tsuruhashi';

    setupCardAbilities() {
        this.interrupt('Return Sharpened Tsuruhashi to your hand')
            .when({
                onCardLeavesPlay: (event, context) => event.isSacrifice && event.card === context.source.parentCharacter
            })
            .gameAction(returnToHand())
            .effect('return it to their hand');
    }
}


export default SharpenedTsuruhashi;

