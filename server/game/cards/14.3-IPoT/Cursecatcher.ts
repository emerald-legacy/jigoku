import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class Cursecatcher extends DrawCard {
    static id = 'cursecatcher';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel province ability')
            .when({
                onInitiateAbilityEffects: event => event.card.type === CardType.Province && //province
                    event.card.controller && event.card.controller.getDynastyCardsInProvince(event.card.location).some(a => a.isFacedown()) //any facedown cards
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of {1}\'s ability', context => context.event.card ?? '');
    }
}


export default Cursecatcher;
