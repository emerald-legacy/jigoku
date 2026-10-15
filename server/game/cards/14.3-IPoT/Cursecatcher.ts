import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class Cursecatcher extends DrawCard {
    static id = 'cursecatcher';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel province ability')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Province &&
                    event.card.controller.getDynastyCardsInProvince(event.card.location).some((a) => a.isFacedown())
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`);
    }
}


export default Cursecatcher;
