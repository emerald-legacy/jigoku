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
            .chatText('cancel the effects of {1}\'s ability', (context) => context.event.card);
    }
}


export default Cursecatcher;
