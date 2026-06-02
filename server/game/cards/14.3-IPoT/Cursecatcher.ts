import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class Cursecatcher extends DrawCard {
    static id = 'cursecatcher';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel province ability',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardType.Province && //province
                    event.card.controller && event.card.controller.getDynastyCardsInProvince(event.card.location).some(a => a.isFacedown()) //any facedown cards
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card ?? '',
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default Cursecatcher;
